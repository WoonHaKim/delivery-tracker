import KREPost from '../../carriers/kr.epost';

describe('test kr.cjlogistics', () => {
  const deliveryId = process.env.KREPost;

  beforeAll(() => {
    if (!deliveryId) fail('No deliveryId');
  });

  test('우체국 택배 가져오기', async () => {
    const response = await KREPost.getTrack(deliveryId as string);
    console.log(response);
  });
});
