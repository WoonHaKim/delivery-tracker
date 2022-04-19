import axios from 'axios';
import { load } from 'cheerio';
import { decode } from 'html-entities';
// const { JSDOM } = require('jsdom')
import qs from 'querystring';
import { TrackingInformation } from '~types';

function parseStatus(s: string) {
  if (s.includes('집하완료')) return { id: 'at_pickup', text: '상품인수' };
  if (s.includes('배달준비'))
    return { id: 'out_for_delivery', text: '배송출발' };
  if (s.includes('배달완료')) return { id: 'delivered', text: '배송완료' };
  return { id: 'in_transit', text: '이동중' };
}

async function getTrack(trackId: string) {
  const trimString = (s: string) => {
    return s.replace(/([\n\t]{1,}|\s{2,})/g, ' ').trim();
  };

  const deliveryInfo = await axios.post(
    'https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm',
    qs.stringify({
      sid1: trackId,
    })
  );

  // const dom = new JSDOM(res.data)
  // const document = dom.window.document

  const $ = load(deliveryInfo.data);

  // const informationTable = document.querySelector('.table_col:nth-child(2)')
  // const progressTable = document.querySelector('.table_col:nth-child(1)')

  const $informationTable = $('#print').find('table');
  const $progressTable = $('#processTable');

  // const informations = informationTable.querySelectorAll('td')
  const $informations = $informationTable.find('td');

  const from = decode($informations.eq(0).html()).split('<br>');
  const to = decode($informations.eq(1).html()).split('<br>');

  // const from = informations[0].innerHTML.split('<br>')
  // const to = informations[1].innerHTML.split('<br>')

  if ($informations.length === 0) {
    return {
      code: 404,
      message: '해당 운송장이 존재하지 않습니다.',
    };
  }

  if ($informationTable.find('tr').length === 3) {
    return {
      code: 404,
      message: trimString(
        $informationTable.find('tr:nth-child(2)').eq(0).text()
      ),
    };
  }

  const shippingInformation = {
    from: {
      name: from[0],
      time: from[0] ? `${from[1].replace(/\./g, '-')}T00:00:00+09:00` : '',
    },
    to: {
      name: to[0],
      time: to[0] ? `${to[1].replace(/\./g, '-')}T00:00:00+09:00` : '',
    },
    state: null,
    progresses: [],
  } as TrackingInformation;

  $progressTable.find('tr').each((_, element) => {
    const td = $(element).find('td');
    if (td.length === 0) {
      return;
    }
    shippingInformation.progresses?.push({
      time: `${td.eq(0).html()?.replace(/\./g, '-')}T${td
        .eq(1)
        .html()}:00+09:00`,
      location: {
        name: td.eq(2).find('a').eq(0).text(),
      },
      status: parseStatus(td.eq(3).text()),
      description: trimString(td.eq(3).text()),
    });
  });

  if (shippingInformation?.progresses?.length)
    shippingInformation.state =
      shippingInformation?.progresses[
        shippingInformation.progresses.length - 1
      ].status;
  else
    shippingInformation.state = {
      id: 'information_received',
      text: '방문예정',
    };

  return shippingInformation;
}

export default {
  info: {
    name: '우체국 택배',
    tel: '+8215881300',
  },
  getTrack,
};
