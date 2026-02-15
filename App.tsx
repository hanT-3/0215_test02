
import React, { useState, useCallback } from 'react';
import { UserData, CouponResponse, AppState } from './types';
import { generateCouponWithAI } from './services/geminiService';
import { Ticket, Gift, Mail, User, CheckCircle2, AlertCircle, ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [formData, setFormData] = useState<UserData>({ name: '', email: '' });
  const [couponData, setCouponData] = useState<CouponResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setState(AppState.LOADING);
    try {
      const result = await generateCouponWithAI(formData);
      setCouponData(result);
      setState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage('쿠폰을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '' });
    setCouponData(null);
    setState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <main className="w-full max-w-xl relative z-10">
        {state === AppState.IDLE && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-500 transform scale-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
                <Gift size={32} />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                지금 가입하고 <br/>
                <span className="text-indigo-600">10,000원 쿠폰</span> 받으세요
              </h1>
              <p className="text-gray-500">이름과 이메일만 입력하면 즉시 쿠폰이 발송됩니다.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="성함을 입력해주세요"
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 rounded-2xl transition-all duration-200 outline-none text-gray-700 font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="쿠폰을 받으실 이메일 주소"
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 rounded-2xl transition-all duration-200 outline-none text-gray-700 font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  무료 쿠폰 받기
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <p className="text-center text-xs text-gray-400 pt-2">
                * 전송된 쿠폰은 마이페이지에서 확인 가능합니다.
              </p>
            </form>
          </div>
        )}

        {state === AppState.LOADING && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-6">AI가 특별한 혜택을 생성 중입니다...</h2>
              <p className="text-gray-500 mt-2">잠시만 기다려 주세요.</p>
            </div>
          </div>
        )}

        {state === AppState.SUCCESS && couponData && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="bg-indigo-600 p-8 text-center text-white relative">
              <div className="absolute top-4 right-4 animate-bounce">
                <Sparkles size={24} className="text-yellow-300" />
              </div>
              <CheckCircle2 size={48} className="mx-auto mb-4 text-white opacity-90" />
              <h2 className="text-2xl font-bold mb-2">쿠폰 발급 성공!</h2>
              <p className="text-indigo-100 opacity-90">{formData.name}님을 위한 특별한 선물이 준비되었습니다.</p>
            </div>
            
            <div className="p-8">
              <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 mb-6 text-center">
                <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">Discount Code</p>
                <div className="text-3xl md:text-4xl font-black text-indigo-700 tracking-wider font-mono">
                  {couponData.couponCode}
                </div>
                <div className="mt-4 inline-block px-4 py-1 bg-white rounded-full text-indigo-600 text-sm font-bold shadow-sm">
                  10,000 KRW OFF
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                <p className="text-gray-700 leading-relaxed italic">
                  "{couponData.welcomeMessage}"
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm text-gray-500 px-2">
                  <span>유효기간</span>
                  <span className="font-bold text-gray-700">{couponData.expiryDate} 까지</span>
                </div>
                <button 
                  onClick={() => alert('코드가 복사되었습니다!')}
                  className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  코드 복사하기
                </button>
                <button 
                  onClick={handleReset}
                  className="w-full bg-transparent hover:bg-gray-100 text-gray-500 py-3 rounded-2xl font-medium transition-colors"
                >
                  처음으로 돌아가기
                </button>
              </div>
            </div>

            <div className="bg-gray-100 py-3 text-center border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShoppingBag size={14} />
                <span>해당 코드는 첫 결제 시에만 적용 가능합니다.</span>
              </div>
            </div>
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">문제가 발생했습니다</h2>
            <p className="text-gray-500 mb-6">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
              다시 시도하기
            </button>
          </div>
        )}
      </main>

      <footer className="mt-8 relative z-10 text-center text-gray-400 text-sm">
        <p>&copy; 2024 특별 혜택 이벤트. All rights reserved.</p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <a href="#" className="hover:text-indigo-500 transition-colors">이용약관</a>
          <span className="text-gray-200">|</span>
          <a href="#" className="hover:text-indigo-500 transition-colors">개인정보처리방침</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
