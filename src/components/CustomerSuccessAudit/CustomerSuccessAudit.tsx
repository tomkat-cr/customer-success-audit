import { useState, useEffect } from 'react';
import { CheckCircle, TrendingUp, Mail, Calendar, Download, ArrowLeft, ArrowRight, Star, Trophy, Target, Clock, DollarSign, LucideRefreshCcw } from 'lucide-react';
import { ExitIntentModal } from './ExitIntentModal.tsx';
import { emailValidation, sendToEmail } from '../../utilities/email_utilities.tsx';
import { trackEvent } from '../../utilities/google_tag.tsx';
import { generateCalendlyLink } from './calendly.tsx';
import { calculateScore, getPersonalizedRecommendations, calculateLeadScore, generatePdfReport } from './calculations.tsx';
import { auditSections } from './auditSections.tsx';
import { addRecaptchaEvent } from '../../utilities/recaptcha.tsx';
import { goToTop, getAppVersion } from '../../utilities/ui.tsx';
import { debug } from '../../utilities/utilities.tsx';

const CustomerSuccessAudit = () => {
  const [currentView, setCurrentView] = useState('lead-form'); // 'lead-form', 'audit', 'results'
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [userInfo, setUserInfo] = useState({

    name: '',
    email: '',
    company: '',
    role: '',
    customers: '',
    phone: '',
    industry: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [completedAudits] = useState(1247);
  const [recentCompletions] = useState(23);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && currentView === 'lead-form' && !showExitIntent) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [currentView, showExitIntent]);

  // GA Page View Tracking
  useEffect(() => {
    trackEvent('page_view', {
      page_title: currentView,
      page_path: `/${currentView}`
    });
    if (currentView === 'results') {
      addRecaptchaEvent();
    }
  }, [currentView]);

  const handleReloadRecaptcha = () => {
    if (debug) console.log('>> handleReloadRecaptcha');
    addRecaptchaEvent();
  }

  const handleStartAudit = () => {
    if (!userInfo.name || !userInfo.email || !userInfo.company) {
      alert('Por favor completa los campos obligatorios: Nombre, Email y Empresa');
      return;
    }

    if (!emailValidation(userInfo.email)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    trackEvent('audit_started', {
      company: userInfo.company,
      role: userInfo.role,
      company_size: userInfo.customers
    });
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentView('audit');
    }, 1500);
  };

  const handleAnswer = (questionId: string, points: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: points }));
    trackEvent('question_answered', { questionId, points });
  };

  const handleNext = () => {
    if (currentSection < auditSections.length - 1) {
      setCurrentSection(currentSection + 1);
      trackEvent('section_completed', { section: currentSection });
    } else {
      const score = calculateScore(answers);
      const leadScore = calculateLeadScore(userInfo, score);
      
      trackEvent('audit_completed', {
        score: score.percentage,
        lead_score: leadScore,
        company: userInfo.company,
        role: userInfo.role
      });
      
      setCurrentView('results');
    }
    goToTop();
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      goToTop();
    }
  };

  const canProceed = () => {
    return auditSections[currentSection].questions.every(q => answers[q.id] !== undefined);
  };

  const handleCalendlyClick = (calendlyLink: string) => {
    trackEvent('calendly_clicked', { urgency: getPersonalizedRecommendations(calculateScore(answers).percentage, userInfo).urgency });
    window.open(calendlyLink, '_blank');
  };

  const handleDownloadReport = () => {
    trackEvent('report_downloaded');
    const doc = generatePdfReport(answers, userInfo);
    // Save the PDF
    doc.save(`CS_Audit_Report_${userInfo.company}.pdf`);
  };

  const handleResourcesClick = () => {
    trackEvent('resources_clicked');
    const doc = generatePdfReport(answers, userInfo);
    // Send to email
    sendToEmail(doc, userInfo);
  };

  // VISTA: FORMULARIO INICIAL
  if (currentView === 'lead-form') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
          <ExitIntentModal
            showExitIntent={showExitIntent}
            setShowExitIntent={setShowExitIntent}
          />
          
          <form>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                <div className="text-center text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-center space-x-4">
                    <span>✅ {completedAudits.toLocaleString()} empresas evaluadas</span>
                    <span>🔥 {recentCompletions} completadas hoy</span>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Trophy className="text-white" size={36} />
                  </div>
                  
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Customer Success Audit {getAppVersion()}
                  </h1>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-xl text-gray-700 font-semibold">
                      Descubre en 5 minutos qué tan efectiva es tu estrategia
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        ⚡ Resultados automáticos
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        💎 Valorado en US$ 497.00
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                        🎯 100% Gratis
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
                  <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                    <Star className="mr-2 text-blue-600" size={20} />
                    Lo que obtendrás:
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-blue-800">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-blue-600 mr-3 flex-shrink-0" />
                      Score personalizado 0-100 puntos
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-blue-600 mr-3 flex-shrink-0" />
                      Plan de acción prioritizado
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-blue-600 mr-3 flex-shrink-0" />
                      Benchmark vs mejores prácticas
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-blue-600 mr-3 flex-shrink-0" />
                      Consulta gratuita personalizada
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre completo*"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={userInfo.name}
                      required
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email corporativo*"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={userInfo.email}
                      required
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Empresa*"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={userInfo.company}
                    required
                    onChange={(e) => setUserInfo({...userInfo, company: e.target.value})}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <select
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={userInfo.role}
                      onChange={(e) => setUserInfo({...userInfo, role: e.target.value})}
                    >
                      <option value="">Tu rol en la empresa</option>
                      <option value="ceo">CEO/Fundador</option>
                      <option value="cs-director">Director de CS (Customer Success)</option>
                      <option value="cs-manager">Manager de CS (Customer Success)</option>
                      <option value="sales">Director/Manager de Ventas</option>
                      <option value="marketing">Marketing</option>
                      <option value="operations">Operaciones</option>
                      <option value="other">Otro</option>
                    </select>

                    <select
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={userInfo.customers}
                      onChange={(e) => setUserInfo({...userInfo, customers: e.target.value})}
                    >
                      <option value="">Número de clientes</option>
                      <option value="1-10">1-10 clientes</option>
                      <option value="11-50">11-50 clientes</option>
                      <option value="51-100">51-100 clientes</option>
                      <option value="101-500">101-500 clientes</option>
                      <option value="500+">500+ clientes</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      placeholder="WhatsApp (opcional)"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    />
                    
                    <select
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={userInfo.industry}
                      onChange={(e) => setUserInfo({...userInfo, industry: e.target.value})}
                    >
                      <option value="">Industria (opcional)</option>
                      <option value="saas">SaaS/Software</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="fintech">Fintech</option>
                      <option value="consulting">Consultoría</option>
                      <option value="agency">Agencia</option>
                      <option value="other">Otra</option>
                    </select>
                  </div>

                  <button
                    onClick={handleStartAudit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-5 px-6 rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 disabled:opacity-70 shadow-xl text-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Procesando tu información...
                      </span>
                    ) : (
                      '🚀 Comenzar Audit GRATUITO - 5 minutos'
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    🔒 Tu información está protegida. No spam, solo resultados valiosos.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }

  // VISTA: RESULTADOS
  if (currentView === 'results') {
    const score = calculateScore(answers);
    const recommendations = getPersonalizedRecommendations(score.percentage, userInfo);
    const leadScore = calculateLeadScore(userInfo, score);
    const calendlyLink = generateCalendlyLink(userInfo, recommendations, answers);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tu Customer Success Score
              </h1>
              <p className="text-gray-600 text-lg">
                Resultados para <span className="font-semibold">{userInfo.name}</span> - <span className="font-semibold">{userInfo.company}</span>
              </p>
            </div>

            <div className={`${recommendations.bgColor} border-2 ${recommendations.borderColor} rounded-3xl p-8 mb-8 text-center relative overflow-hidden`}>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  {recommendations.icon}
                </div>
                
                <div className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {score.percentage}%
                </div>
                
                <div className={`text-2xl font-bold ${recommendations.color} mb-3`}>
                  {recommendations.level}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {recommendations.title}
                </h2>
                
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  {recommendations.description}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{score.points}</div>
                    <div className="text-sm text-gray-600">Puntos obtenidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{score.maxPoints}</div>
                    <div className="text-sm text-gray-600">Puntos posibles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{leadScore}</div>
                    <div className="text-sm text-gray-600">Lead Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Target className="mr-3" size={28} />
                📋 Tu Plan de Acción Prioritario
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4 text-blue-300">Próximos pasos inmediatos:</h4>
                  <ul className="space-y-3">
                    {recommendations.nextSteps.map((step: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-100">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4 text-green-300">Impacto esperado:</h4>
                  <div className="space-y-3">
                    {score.percentage < 50 ? (
                      <>
                        <div className="flex items-center">
                          <DollarSign className="text-green-400 mr-2" size={20} />
                          <span>Reducción de churn: 30-50%</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="text-green-400 mr-2" size={20} />
                          <span>Aumento en retención: $50K-200K anuales</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="text-green-400 mr-2" size={20} />
                          <span>Tiempo de implementación: 60-90 días</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <DollarSign className="text-green-400 mr-2" size={20} />
                          <span>Optimización revenue: 15-25%</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="text-green-400 mr-2" size={20} />
                          <span>Expansion opportunities: $25K-100K</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="text-green-400 mr-2" size={20} />
                          <span>Tiempo de optimización: 30-60 días</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                ¿Listo para implementar estas mejoras?
              </h3>
              
              <p className="text-green-700 mb-6 max-w-2xl mx-auto">
                {score.percentage < 50 ? 
                  "Tu situación requiere atención inmediata. Agenda una consulta de emergencia para crear un plan de rescate." :
                  "Tienes una buena base. Vamos a optimizar tu estrategia para maximizar resultados."
                }
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <button 
                  onClick={() => handleCalendlyClick(calendlyLink)}
                  className={`${recommendations.urgency === 'critical' ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 
                    recommendations.urgency === 'high' ? 'bg-orange-600 hover:bg-orange-700' : 
                    'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-4 rounded-xl transition flex items-center justify-center font-semibold`}
                >
                  <Calendar className="mr-2" size={20} />
                  {recommendations.urgency === 'critical' ? 'Consulta URGENTE' : 
                   recommendations.urgency === 'high' ? 'Consulta Prioritaria' : 
                   'Consulta Estratégica'}
                </button>
                
                <button 
                  onClick={handleDownloadReport}
                  className="bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition flex items-center justify-center font-semibold"
                >
                  <Download className="mr-2" size={20} />
                  Reporte Completo PDF
                </button>
                
                <button 
                  onClick={handleResourcesClick}
                  className="bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center font-semibold"
                >
                  <Mail className="mr-2" size={20} />
                  Recursos + Checklist
                </button>
              </div>

              <div className='mt-5 mb-5 flex justify-center items-center'>
                <div id="recaptcha-container"></div>
                <div className="ml-2">
                  <button onClick={handleReloadRecaptcha} className="bg-indigo-600 text-white p-2 pl-3 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center font-semibold">
                    <LucideRefreshCcw className="mr-2" size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white rounded-2xl border border-green-200">
                <h4 className="font-bold text-gray-800 mb-3">🎁 BONUS por completar la auditoría:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>✅ Checklist de 25 puntos para CS</div>
                  <div>✅ Template de Customer Health Score</div>
                  <div>✅ Calculadora de ROI en CS</div>
                  {/* <div>✅ Acceso a Masterclass exclusiva</div> */}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setCurrentView('lead-form');
                  setAnswers({});
                  setCurrentSection(0);
                  setUserInfo({
                    name: '', email: '', company: '', role: '', customers: '', phone: '', industry: ''
                  });
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Hacer otro audit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISTA: AUDIT
  const currentQuestions = auditSections[currentSection];
  const progress = ((currentSection + 1) / auditSections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Customer Success Audit {getAppVersion()}
            </h1>
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow">
              Sección {currentSection + 1} de {auditSections.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">{Math.round(progress)}% completado</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              {currentQuestions.icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentQuestions.title}
            </h2>
            <p className="text-gray-600 text-lg">{currentQuestions.subtitle}</p>
          </div>

          <div className="space-y-10">
            {currentQuestions.questions.map((question, qIndex) => (
              <div key={question.id} className="border-b border-gray-100 pb-8 last:border-b-0">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-start">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                    {qIndex + 1}
                  </span>
                  <span className="pt-1">{question.question}</span>
                </h3>
                
                <div className="space-y-3 ml-12">
                  {question.options.map((option, oIndex) => (
                    <label 
                      key={oIndex}
                      className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        answers[question.id] === option.points 
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg transform scale-105' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.points}
                        checked={answers[question.id] === option.points}
                        onChange={() => handleAnswer(question.id, option.points)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 ${
                        answers[question.id] === option.points 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {answers[question.id] === option.points && (
                          <div className="w-3 h-3 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <span className="text-gray-900 flex-1 font-medium">{option.text}</span>
                      <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                        answers[question.id] === option.points 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-blue-600'
                      }`}>
                        {option.points} pts
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-100">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="flex items-center px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              <ArrowLeft className="mr-2" size={20} />
              Anterior
            </button>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">
                Progreso de la sección: {auditSections[currentSection].questions.filter(q => answers[q.id] !== undefined).length} / {auditSections[currentSection].questions.length}
              </div>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(auditSections[currentSection].questions.filter(q => answers[q.id] !== undefined).length / auditSections[currentSection].questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
            >
              {currentSection === auditSections.length - 1 ? (
                <>
                  Ver Resultados
                  <Trophy className="ml-2" size={20} />
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="ml-2" size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSuccessAudit;