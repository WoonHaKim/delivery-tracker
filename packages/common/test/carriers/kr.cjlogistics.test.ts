import KRCJLogistics from '../../carriers/kr.cjlogistics';

describe('test kr.cjlogistics', () => {
  const deliveryId = process.env.KRCJLogistics;

  beforeAll(() => {
    if (!deliveryId) fail('No deliveryId');
  });

  test('CJ 택배 가져오기', async () => {
    const response = await KRCJLogistics.getTrack(deliveryId as string);
    console.log(response);
  });
});
