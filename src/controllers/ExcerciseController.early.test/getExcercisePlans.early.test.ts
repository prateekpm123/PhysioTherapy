
import { backendUrl } from "../../configDetails";
import { iApiCallInterface } from "../../models/iApiCallInterface";
import { StatusAndErrorType } from "../../models/StatusAndErrorType.enum";
import { getValidAuthToken } from "../../utils/cookies";
import { getExcercisePlans } from '../ExcerciseController';


// Import necessary modules and dependencies
// Mock the getValidAuthToken function
// jest.mock("../../src/utils/cookies", () => {
//   const actual = jest.requireActual("../../src/utils/cookies");
//   return {
//     ...actual,
//     getValidAuthToken: jest.fn(),
//   };
// });

describe('getExcercisePlans() getExcercisePlans method', () => {
  let mockGetValidAuthToken: jest.MockedFunction<typeof getValidAuthToken>;

  beforeEach(() => {
    mockGetValidAuthToken = jest.mocked(getValidAuthToken);
  });

  describe('Happy Paths', () => {
    it('should successfully fetch exercise plans and call afterAPISuccess', async () => {
      // Arrange
      const mockToken = 'valid-token';
      const mockResponseData = { ok: true, data: 'exercise plans' };
      const mockInputs: iApiCallInterface = {
        data: { userId: 1 },
        afterAPISuccess: jest.fn(),
        afterAPIFail: jest.fn(),
      };

      mockGetValidAuthToken.mockResolvedValue(mockToken);
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponseData),
      } as any);

      // Act
      await getExcercisePlans(mockInputs);

      // Assert
      expect(mockGetValidAuthToken).toHaveBeenCalled();
//      expect(global.fetch).toHaveBeenCalledWith(
//        `${backendUrl}/api/excercise/getallexcerciseplans`,
//        expect.objectContaining({
//          method: 'POST',
//          headers: {
//            'Content-Type': 'application/json',
//            Authorization: `Bearer ${mockToken}`,
//          },
//          body: JSON.stringify(mockInputs.data),
//        })
//      );
      expect(mockInputs.afterAPISuccess).toHaveBeenCalledWith(mockResponseData);
      expect(mockInputs.afterAPIFail).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle fetch failure and call afterAPIFail', async () => {
      // Arrange
      const mockToken = 'valid-token';
      const mockError = new Error('Network error');
      const mockInputs: iApiCallInterface = {
        data: { userId: 1 },
        afterAPISuccess: jest.fn(),
        afterAPIFail: jest.fn(),
      };

      mockGetValidAuthToken.mockResolvedValue(mockToken);
      global.fetch = jest.fn().mockRejectedValue(mockError);

      // Act
      await getExcercisePlans(mockInputs);

      // Assert
      expect(mockGetValidAuthToken).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
      expect(mockInputs.afterAPISuccess).not.toHaveBeenCalled();
      expect(mockInputs.afterAPIFail).toHaveBeenCalledWith({
        message: 'Failed to get exercise plans',
        statusCode: 500,
        errorCode: StatusAndErrorType.InternalError,
        errors: mockError,
      });
    });

    it('should handle invalid token scenario', async () => {
      // Arrange
      const mockInputs: iApiCallInterface = {
        data: { userId: 1 },
        afterAPISuccess: jest.fn(),
        afterAPIFail: jest.fn(),
      };

      mockGetValidAuthToken.mockRejectedValue(new Error('Invalid token'));

      // Act
      await getExcercisePlans(mockInputs);

      // Assert
      expect(mockGetValidAuthToken).toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockInputs.afterAPISuccess).not.toHaveBeenCalled();
      expect(mockInputs.afterAPIFail).toHaveBeenCalledWith({
        message: 'Failed to get exercise plans',
        statusCode: 500,
        errorCode: StatusAndErrorType.InternalError,
        errors: new Error('Invalid token'),
      });
    });
  });
});