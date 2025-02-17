import {register} from '../auth/register';
import loginService from '../auth/login';
import {getAccessToken, setAccessToken} from '../utils';
import {deleteUser} from '../user/users';
import imageService, {CustomImage} from './images';

jest.mock('@react-native-async-storage/async-storage');

describe('Image api integration', () => {
  let testUser = {
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'testpassword123',
  };

  let user_id: number;
  let img: CustomImage;
  const image_url =
    'https://www.paramountshop.com/cdn/shop/files/spongebob-squarepants-life-sized-cardboard-cutout-standee-725187.jpg?v=1718292084';

  beforeAll(async () => {
    const response = await register(
      testUser.username,
      testUser.email,
      testUser.password,
    );
    user_id = response.id;
    const data = await loginService.login(testUser.username, testUser.password);
    await setAccessToken(data.accessToken);
  });

  it('should add a new image for user', async () => {
    const data = await imageService.create(image_url);
    expect(data.image_url).toBe(image_url);
    expect(data.user.id).toBe(user_id);
    img = data;
  });

  it('should get all images for logged in user', async () => {
    const data = await imageService.getAll();
    console.log(data);
    expect(data).toContainEqual(img);
  });

  it('should get image by image id', async () => {
    const imageList = await imageService.getAll();
    const idx = Math.floor(Math.random() * imageList.length);
    const testImage = imageList[idx];
    const imageById = await imageService.getById(testImage.id);
    expect(imageById).toEqual(testImage);
  });

  it('should delete own image by image id', async () => {
    const imageList = await imageService.getAll();
    // TODO: edit user service to get images of user
    const testImage = imageList.find(x => x.user.id === user_id);
    expect(testImage).toBeDefined();
    if (!testImage) {
      fail('Could not find image by user id');
    }
    const imageById = await imageService.getById(testImage.id);
    expect(imageById).toEqual(testImage);
    console.log(imageById, user_id);
    const response = await imageService.deleteImage(imageById.id);
    expect(response.status).toBe(204);
  });

  afterAll(async () => {
    if (user_id) {
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          await deleteUser(user_id, accessToken);
        }
      } catch (error: any) {
        console.error(error.response?.data || error.message);
      }
    }
  });
});
