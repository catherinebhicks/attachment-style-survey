import React, { useState } from 'react';
import { ChevronRight, Heart, Shield, Zap, Users, BarChart3, Check } from 'lucide-react';

interface Option {
  text: string;
  score: {
    secure: number;
    anxious: number;
    avoidant: number;
    fearful: number;
  };
}

interface Question {
  text: string;
  subtitle: string;
  options: Option[];
}

interface AttachmentStyle {
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  traits: string[];
}

interface Results {
  percentages: Record<string, number>;
  sorted: Array<{ style: string; percentage: number }>;
  totalSelections: number;
}

const AttachmentStyleQuiz: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'quiz' | 'result'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentSelections, setCurrentSelections] = useState<number[]>([]);
  const [allAnswers, setAllAnswers] = useState<Option[][]>([]);
  const [results, setResults] = useState<Results | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const questions: Question[] = [
    {
      text: "When someone I care about pulls away, I tend to...",
      subtitle: "Select all that feel true for you",
      options: [
        { text: "Give them space while staying available", score: { secure: 3, anxious: 0, avoidant: 1, fearful: 1 } },
        { text: "Worry they're losing interest in me", score: { secure: 0, anxious: 3, avoidant: 0, fearful: 2 } },
        { text: "Focus on other things in my life", score: { secure: 1, anxious: 0, avoidant: 3, fearful: 1 } },
        { text: "Feel confused and withdraw myself", score: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
        { text: "Try to reconnect more intensely", score: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } }
      ]
    },
    {
      text: "In relationships, I find it easiest to...",
      subtitle: "Choose what resonates with you",
      options: [
        { text: "Share my feelings openly and honestly", score: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
        { text: "Express my needs, even if it feels vulnerable", score: { secure: 2, anxious: 3, avoidant: 0, fearful: 1 } },
        { text: "Keep some parts of myself private", score: { secure: 0, anxious: 0, avoidant: 3, fearful: 2 } },
        { text: "Struggle between wanting closeness and independence", score: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
        { text: "Share deeply but worry about being too much", score: { secure: 0, anxious: 2, avoidant: 0, fearful: 3 } }
      ]
    },
    {
      text: "When it comes to depending on others, I...",
      subtitle: "Select all that apply to you",
      options: [
        { text: "Feel comfortable asking for help when needed", score: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
        { text: "Often seek reassurance from those close to me", score: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
        { text: "Prefer to handle things on my own", score: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
        { text: "Want support but fear being a burden", score: { secure: 1, anxious: 1, avoidant: 1, fearful: 3 } },
        { text: "Go back and forth between seeking and avoiding help", score: { secure: 0, anxious: 2, avoidant: 1, fearful: 3 } }
      ]
    },
    {
      text: "My ideal relationship dynamic involves...",
      subtitle: "What feels right to you?",
      options: [
        { text: "Balance between togetherness and independence", score: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
        { text: "Lots of quality time and emotional closeness", score: { secure: 1, anxious: 3, avoidant: 0, fearful: 1 } },
        { text: "Maintaining my autonomy and personal space", score: { secure: 1, anxious: 0, avoidant: 3, fearful: 1 } },
        { text: "Finding someone who understands my complexity", score: { secure: 0, anxious: 1, avoidant: 0, fearful: 3 } },
        { text: "Deep connection with room to be myself", score: { secure: 3, anxious: 2, avoidant: 1, fearful: 1 } }
      ]
    },
    {
      text: "When conflicts arise in relationships, I typically...",
      subtitle: "How do you usually respond?",
      options: [
        { text: "Address them calmly and work toward resolution", score: { secure: 3, anxious: 0, avoidant: 0, fearful: 0 } },
        { text: "Feel anxious until we've talked it through", score: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
        { text: "Need time alone before discussing", score: { secure: 1, anxious: 0, avoidant: 3, fearful: 1 } },
        { text: "Feel overwhelmed and unsure how to respond", score: { secure: 0, anxious: 1, avoidant: 0, fearful: 3 } },
        { text: "Want to resolve it but also want to escape", score: { secure: 0, anxious: 1, avoidant: 2, fearful: 3 } }
      ]
    },
    {
      text: "Trust in relationships comes...",
      subtitle: "What's your experience with trust?",
      options: [
        { text: "Naturally as I get to know someone", score: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
        { text: "With constant reassurance and validation", score: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
        { text: "Slowly, and I maintain healthy skepticism", score: { secure: 1, anxious: 0, avoidant: 3, fearful: 1 } },
        { text: "In waves - sometimes easily, sometimes not at all", score: { secure: 0, anxious: 1, avoidant: 0, fearful: 3 } },
        { text: "Through consistent actions over time", score: { secure: 3, anxious: 1, avoidant: 2, fearful: 1 } }
      ]
    },
    {
      text: "In stressful times, I tend to...",
      subtitle: "How do you cope with stress in relationships?",
      options: [
        { text: "Reach out to trusted people for support", score: { secure: 3, anxious: 2, avoidant: 0, fearful: 0 } },
        { text: "Seek extra reassurance from my partner", score: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
        { text: "Withdraw and handle things independently", score: { secure: 0, anxious: 0, avoidant: 3, fearful: 2 } },
        { text: "Feel torn between reaching out and pulling away", score: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
        { text: "Sometimes reach out, sometimes shut down", score: { secure: 0, anxious: 2, avoidant: 2, fearful: 3 } }
      ]
    }
  ];

  const attachmentStyles: Record<string, AttachmentStyle> = {
    secure: {
      title: "Secure",
      icon: <Heart className="w-8 h-8" />,
      color: "from-rose-400 to-pink-600",
      description: "Comfortable with intimacy and independence, effective communication, natural trust-building",
      traits: ["Emotionally available", "Good boundaries", "Open communication", "Balanced perspective"]
    },
    anxious: {
      title: "Anxious",
      icon: <Zap className="w-8 h-8" />,
      color: "from-amber-400 to-orange-600", 
      description: "Highly empathetic, values closeness, may seek reassurance, passionate about relationships",
      traits: ["Deeply caring", "Emotionally intuitive", "Values connection", "Expressive"]
    },
    avoidant: {
      title: "Avoidant",
      icon: <Shield className="w-8 h-8" />,
      color: "from-emerald-400 to-teal-600",
      description: "Values independence, self-reliant, prefers some emotional distance, strong boundaries",
      traits: ["Self-sufficient", "Independent", "Clear boundaries", "Logical approach"]
    },
    fearful: {
      title: "Fearful-Avoidant",
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-400 to-indigo-600",
      description: "Complex mix of wanting closeness while fearing vulnerability, highly perceptive",
      traits: ["Introspective", "Perceptive", "Complex emotions", "Adaptable"]
    }
  };

  const toggleSelection = (optionIndex: number) => {
    const newSelections = currentSelections.includes(optionIndex)
      ? currentSelections.filter(i => i !== optionIndex)
      : [...currentSelections, optionIndex];
    setCurrentSelections(newSelections);
  };

  const nextQuestion = () => {
    if (currentSelections.length === 0) return;
    
    setIsAnimating(true);
    
    // Store selected answers for this question
    const selectedOptions = currentSelections.map(index => questions[currentQuestion].options[index]);
    const newAllAnswers = [...allAnswers, selectedOptions];
    setAllAnswers(newAllAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setCurrentSelections([]);
      } else {
        const results = calculateResults(newAllAnswers);
        setResults(results);
        setCurrentScreen('result');
      }
      setIsAnimating(false);
    }, 300);
  };

  const calculateResults = (answers: Option[][]): Results => {
    const scores = { secure: 0, anxious: 0, avoidant: 0, fearful: 0 };
    let totalSelections = 0;
    
    answers.forEach(questionAnswers => {
      questionAnswers.forEach(answer => {
        totalSelections++;
        Object.keys(scores).forEach(style => {
          scores[style as keyof typeof scores] += answer.score[style as keyof typeof answer.score];
        });
      });
    });

    // Calculate percentages based on max possible score from selections
    const maxPossiblePerSelection = 3;
    const maxPossible = totalSelections * maxPossiblePerSelection;
    
    const percentages: Record<string, number> = {};
    Object.keys(scores).forEach(style => {
      percentages[style] = maxPossible > 0 ? Math.round((scores[style as keyof typeof scores] / maxPossible) * 100) : 0;
    });

    // Sort by percentage for display
    const sorted = Object.entries(percentages)
      .sort(([,a], [,b]) => b - a)
      .map(([style, percentage]) => ({ style, percentage }));

    return { percentages, sorted, totalSelections };
  };

  const restart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentScreen('welcome');
      setCurrentQuestion(0);
      setCurrentSelections([]);
      setAllAnswers([]);
      setResults(null);
      setIsAnimating(false);
    }, 300);
  };

  const startQuiz = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentScreen('quiz');
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className={`transition-all duration-500 transform ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
          {currentScreen === 'welcome' && (
            <div className="text-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-pink-500 to-violet-600 opacity-30 rounded-full"></div>
                <h1 className="relative text-6xl font-bold text-white mb-4 tracking-tight">
                  Explore Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">
                    Attachment Patterns
                  </span>
                </h1>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto">
                <p className="text-lg text-gray-200 leading-relaxed mb-4">
                  Most people have elements of multiple attachment styles that can vary by relationship, stress level, and life experiences.
                </p>
                <p className="text-base text-gray-300 leading-relaxed mb-4">
                  <strong>You can select multiple answers</strong> for each question - choose everything that resonates with you.
                </p>
                <p className="text-sm text-gray-400">
                  This assessment will show you your unique attachment pattern blend rather than placing you in a single category.
                </p>
              </div>
              
              <button
                onClick={startQuiz}
                className="group relative inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <span>Explore Your Patterns</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
              </button>
            </div>
          )}

          {currentScreen === 'quiz' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index < currentQuestion
                          ? 'w-12 bg-gradient-to-r from-pink-400 to-violet-400'
                          : index === currentQuestion
                          ? 'w-16 bg-white/50'
                          : 'w-8 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/60 text-sm font-medium">
                  {currentQuestion + 1} of {questions.length}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-2 leading-relaxed">
                  {questions[currentQuestion].text}
                </h2>
                <p className="text-white/70 mb-8 text-lg">
                  {questions[currentQuestion].subtitle}
                </p>
                
                <div className="space-y-3 mb-8">
                  {questions[currentQuestion].options.map((option, index) => {
                    const isSelected = currentSelections.includes(index);
                    return (
                      <button
                        key={index}
                        onClick={() => toggleSelection(index)}
                        className={`w-full text-left p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                          isSelected 
                            ? 'bg-white/20 border-white/50 text-white shadow-lg' 
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'border-white bg-white' 
                              : 'border-white/40'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-indigo-900" />}
                          </div>
                          <span className="text-lg leading-relaxed flex-1">{option.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">
                    {currentSelections.length === 0 
                      ? "Select at least one option to continue" 
                      : `${currentSelections.length} selected`
                    }
                  </span>
                  <button
                    onClick={nextQuestion}
                    disabled={currentSelections.length === 0}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      currentSelections.length > 0
                        ? 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30 hover:scale-105'
                        : 'bg-white/5 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'result' && results && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 text-white mb-6 shadow-2xl">
                  <BarChart3 className="w-10 h-10" />
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-4">
                  Your Attachment Pattern
                </h2>
                
                <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                  Based on your {results.totalSelections} selections, here's your unique blend of attachment styles. You might recognize different patterns in different relationships or situations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {results.sorted.map(({ style, percentage }) => (
                  <div key={style} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${attachmentStyles[style].color} text-white`}>
                        {attachmentStyles[style].icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {attachmentStyles[style].title}
                        </h3>
                        <div className="text-2xl font-bold text-white">
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${attachmentStyles[style].color} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    
                    <p className="text-gray-200 text-sm leading-relaxed mb-3">
                      {attachmentStyles[style].description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {attachmentStyles[style].traits.map((trait, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/10 backdrop-blur-sm text-white/90 px-2 py-1 rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-semibold text-white mb-4">Understanding Your Pattern</h3>
                <div className="space-y-4 text-gray-200 leading-relaxed">
                  <p>
                    <strong>Your primary tendencies:</strong> You show strongest alignment with {attachmentStyles[results.sorted[0].style].title.toLowerCase()} patterns ({results.sorted[0].percentage}%), but this doesn't define you completely.
                  </p>
                  <p>
                    <strong>Your complexity:</strong> {results.sorted.filter(({percentage}) => percentage > 15).length > 1 
                      ? `You selected responses reflecting ${results.sorted.filter(({percentage}) => percentage > 15).length} different attachment styles, which shows the nuanced way you experience relationships.`
                      : 'You show a clear primary pattern, but remember that attachment styles can shift based on relationships, stress, and personal growth.'
                    }
                  </p>
                  <p>
                    <strong>Growth insight:</strong> Understanding your patterns helps you recognize when you might be operating from a place of stress versus security. The fact that you could relate to multiple responses shows healthy self-awareness.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={restart}
                  className="group relative inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <span>Explore Again</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentStyleQuiz;