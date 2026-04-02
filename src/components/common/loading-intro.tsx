'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Coffee, BookOpen } from 'lucide-react';

export function LoadingIntro() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const messages = [
    { text: "안녕하세요, 저의 블로그에 와주셔서 감사합니다.", icon: Heart },
    { text: "이제 곧 시작합니다.", icon: Sparkles },
    { text: "잠시만 기다려주세요...", icon: Coffee },
  ];

  useEffect(() => {
    // 컴포넌트 마운트 시 애니메이션 시작
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showContent) return;

    // 메시지 순환
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [showContent, messages.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 z-50 flex items-center justify-center transition-colors duration-200">
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-md mx-auto px-6"
          >
            {/* 로고/아이콘 */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg dark:shadow-slate-800/50 transition-colors duration-200">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </motion.div>

            {/* 메시지 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  {messages[currentMessage].icon && (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      {React.createElement(messages[currentMessage].icon, { className: "h-6 w-6 text-blue-600 dark:text-blue-400 transition-colors duration-200" })}
                    </motion.div>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-200">
                    {messages[currentMessage].text}
                  </h1>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
