import supertest from 'supertest';
import app from '../server';

describe('get Medical history route', () => {
  describe('GET /medical-history', () => {
    describe('user is not authorized', () => {
      it('should return a 401', async () => {
        const { statusCode, body } = await supertest(app).get(
          '/api/medical-history',
        );
        const errorExpected = { error: { message: 'Not Authorized' } };
        expect(statusCode).toBe(401);
        expect(JSON.stringify(body)).toBe(JSON.stringify(errorExpected));
      });
    });
  });
});
