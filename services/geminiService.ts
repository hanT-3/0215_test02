
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, CouponResponse } from "../types";

export const generateCouponWithAI = async (userData: UserData): Promise<CouponResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `이 사용자의 이름은 '${userData.name}'입니다. 
    이 사용자를 위한 따뜻하고 친절한 환영 인사와 쇼핑을 독려하는 문구 2문장을 한국어로 작성해주세요. 
    또한 무작위로 생성된 것처럼 보이는 8자리 대문자/숫자 조합의 특별한 쿠폰 코드도 생성해주세요.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          welcomeMessage: {
            type: Type.STRING,
            description: 'A friendly greeting message for the user in Korean.',
          },
          couponCode: {
            type: Type.STRING,
            description: 'A random 8-character string (uppercase + numbers).',
          },
          expiryDate: {
            type: Type.STRING,
            description: 'Today date + 30 days in YYYY.MM.DD format.',
          }
        },
        required: ["welcomeMessage", "couponCode", "expiryDate"]
      },
    },
  });

  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr) as CouponResponse;
};
