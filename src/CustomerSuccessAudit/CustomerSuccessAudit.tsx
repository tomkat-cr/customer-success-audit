import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Mail, Calendar, Download, ArrowLeft, ArrowRight } from 'lucide-react';

const CustomerSuccessAudit = () => {
  const [currentView, setCurrentView] = useState('lead-form'); // 'lead-form', 'audit', 'results'
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    customers: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auditSections = [
    {
      title: "Fundamentos de Customer Success",
      subtitle: "Estrategia, recursos y procesos base",
      questions: [
        {
          id: 'strategy',
          question: '¿Tienes una estrategia formal de Customer Success documentada?',
          options: [
            { text: 'Sí, completamente desarrollada y comunicada', points: 25 },
            { text: 'Sí, pero necesita refinamiento', points: 15 },
            { text: 'Existe informalmente', points: 8 },
            { text: 'No existe', points: 0 }
          ]
        },
        {
          id: 'alignment',
          question: '¿Están alineados los objetivos de CS con los objetivos de negocio?',
          options: [
            { text: 'Completamente alineados con métricas claras', points: 20 },
            { text: 'Mayormente alineados', points: 12 },
            { text: 'Parcialmente alineados', points: 6 },
            { text: 'No están alineados', points: 0 }
          ]
        },
        {
          id: 'team',
          question: '¿Tienes un equipo dedicado de Customer Success?',
          options: [
            { text: 'Sí, equipo especializado y bien estructurado', points: 25 },
            { text: 'Sí, pero necesita más recursos', points: 15 },
            { text: 'Personal parcialmente dedicado', points: 8 },
            { text: 'No hay equipo dedicado', points: 0 }
          ]
        }
      ]
    },
    {
      title: "Métricas y Análisis",
      subtitle: "Medición, análisis y predicción",
      questions: [
        {
          id: 'churn',
          question: '¿Mides y monitoreas el Churn Rate regularmente?',
          options: [
            { text: 'Sí, con análisis detallado por segmentos', points: 25 },
            { text: 'Sí, métricas básicas mensuales', points: 15 },
            { text: 'Ocasionalmente', points: 8 },
            { text: 'No lo medimos', points: 0 }
          ]
        },
        {
          id: 'health',
          question: '¿Tienes un sistema de Customer Health Score?',
          options: [
            { text: 'Sistema automatizado y preciso', points: 25 },
            { text: 'Sistema manual pero efectivo', points: 15 },
            { text: 'Sistema básico', points: 8 },
            { text: 'No tenemos health scoring', points: 0 }
          ]
        }
      ]
    },
    {
      title: "Experiencia del Cliente",
      subtitle: "Comunicación, engagement y resolución",
      questions: [
        {
          id: 'communication',
          question: '¿Mantienes comunicación proactiva con los clientes?',
          options: [
            { text: 'Comunicación sistemática y personalizada', points: 25 },
            { text: 'Comunicación regular pero básica', points: 15 },
            { text: 'Comunicación ocasional', points: 8 },
            { text: 'Solo comunicación reactiva', points: 0 }
          ]
        },
        {
          id: 'risk',
          question: '¿Tienes un proceso para identificar clientes en riesgo?',
          options: [
            { text: 'Sistema automatizado de early warning', points: 20 },
            { text: 'Proceso manual pero efectivo', points: 12 },
            { text: 'Identificación básica', points: 6 },
            { text: 'Sin proceso de identificación', points: 0 }
          ]
        }
      ]
    }
  ];

  const calculateScore = () => {
    let totalPoints = 0;
    let maxPoints = 0;

    auditSections.forEach(section => {
      section.questions.forEach(question => {
        maxPoints += Math.max(...question.options.map(opt => opt.points));
        if (answers[question.id] !== undefined) {
          totalPoints += answers[question.id];
        }
      });
    });

    return {
      points: totalPoints,
      maxPoints: maxPoints,
      percentage: Math.round((totalPoints / maxPoints) * 100)
    };
  };

  const getRecommendations = (percentage: number) => {
    if (percentage >= 80) {
      return {
        level: "EXCELENTE",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: <CheckCircle className="text-green-600" size={32} />,
        title: "¡Felicitaciones! Estrategia de CS Madura",
        description: "Tienes una estrategia de Customer Success excepcional.",
        nextSteps: [
          "Optimización continua basada en data",
          "Expansión a nuevos mercados/segmentos",
          "Mentorización a otras organizaciones",
          "Automatización de procesos avanzados"
        ]
      };
    } else if (percentage >= 60) {
      return {
        level: "BUENO",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: <TrendingUp className="text-blue-600" size={32} />,
        title: "Base Sólida con Oportunidades Claras",
        description: "Tienes fundamentos sólidos, pero hay áreas de mejora.",
        nextSteps: [
          "Identificar las 3 áreas de menor puntaje",
          "Crear plan de mejora de 90 días",
          "Implementar métricas faltantes",
          "Capacitar al equipo en mejores prácticas"
        ]
      };
    } else if (percentage >= 40) {
      return {
        level: "REGULAR",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: <AlertTriangle className="text-yellow-600" size={32} />,
        title: "Atención Urgente Requerida",
        description: "Tu Customer Success necesita mejoras importantes.",
        nextSteps: [
          "Audit completo con consultor externo",
          "Redefinición de estrategia de CS",
          "Inversión en herramientas y capacitación",
          "Definir quick wins para 30 días"
        ]
      };
    } else {
      return {
        level: "CRÍTICO",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: <XCircle className="text-red-600" size={32} />,
        title: "¡ALERTA ROJA! Riesgo Alto de Churn",
        description: "Tu organización está en riesgo crítico.",
        nextSteps: [
          "Contratar consultor especializado URGENTE",
          "Implementar estrategia de emergencia",
          "Asignar recursos críticos al CS",
          "Comunicación inmediata con clientes clave"
        ]
      };
    }
  };

  const handleStartAudit = () => {
    if (!userInfo.name || !userInfo.email || !userInfo.company) {
      alert('Por favor completa los campos obligatorios: Nombre, Email y Empresa');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentView('audit');
    }, 1000);
  };

  const handleAnswer = (questionId: string, points: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: points }));
  };

  const handleNext = () => {
    if (currentSection < auditSections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setCurrentView('results');
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const canProceed = () => {
    return auditSections[currentSection].questions.every(q => answers[q.id] !== undefined);
  };

  // VISTA: FORMULARIO INICIAL
  if (currentView === 'lead-form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Customer Success Audit Gratuito
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Descubre qué tan efectiva es tu estrategia de Customer Success
              </p>
              <p className="text-sm text-green-600 font-semibold">
                ⚡ Resultados automáticos en 5 minutos • Valorado en $497
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-4">Lo que obtendrás:</h3>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-blue-600 mr-3" />
                  Score personalizado de 0-100 puntos
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-blue-600 mr-3" />
                  Plan de acción prioritizado
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-blue-600 mr-3" />
                  Benchmark vs mejores prácticas
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre completo*"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email corporativo*"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
              </div>

              <input
                type="text"
                placeholder="Empresa*"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={userInfo.company}
                onChange={(e) => setUserInfo({ ...userInfo, company: e.target.value })}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={userInfo.role}
                  onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
                >
                  <option value="">Selecciona tu rol</option>
                  <option value="ceo">CEO/Founder</option>
                  <option value="cs-manager">CS Manager</option>
                  <option value="cs-director">CS Director</option>
                  <option value="sales">Sales</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                  <option value="other">Otro</option>
                </select>

                <select
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={userInfo.customers}
                  onChange={(e) => setUserInfo({ ...userInfo, customers: e.target.value })}
                >
                  <option value="">Número de clientes</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-100">51-100</option>
                  <option value="101-500">101-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>

              <button
                onClick={handleStartAudit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 transform hover:scale-105 disabled:opacity-70 shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </span>
                ) : (
                  '🚀 Comenzar Audit Gratuito'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISTA: RESULTADOS
  if (currentView === 'results') {
    const score = calculateScore();
    const recommendations = getRecommendations(score.percentage);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tu Customer Success Score
              </h1>
              <p className="text-gray-600">Resultados para {userInfo.name} - {userInfo.company}</p>
            </div>

            <div className={`${recommendations.bgColor} border-2 ${recommendations.borderColor} rounded-2xl p-8 mb-8 text-center`}>
              <div className="flex justify-center mb-4">
                {recommendations.icon}
              </div>
              <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {score.percentage}%
              </div>
              <div className={`text-xl font-semibold ${recommendations.color} mb-2`}>
                {recommendations.level}
              </div>
              <p className="text-lg text-gray-700 mb-4">
                {recommendations.title}
              </p>
              <p className="text-gray-600">
                {recommendations.description}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
              <h3 className="text-xl font-semibold mb-4">📋 Tus Próximos Pasos Prioritarios</h3>
              <ul className="space-y-3">
                {recommendations.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                ¿Necesitas ayuda para implementar estas mejoras?
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => alert('¡Gracias por tu interés! Te contactaremos pronto.')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <Calendar className="mr-2" size={16} />
                  Consulta Gratuita
                </button>
                <button
                  onClick={() => alert('Descargando reporte...')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                >
                  <Download className="mr-2" size={16} />
                  Descargar Reporte
                </button>
                <button
                  onClick={() => alert('¡Revisa tu email para recursos gratuitos!')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
                >
                  <Mail className="mr-2" size={16} />
                  Recursos Gratuitos
                </button>
              </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Customer Success Audit</h1>
            <span className="text-sm text-gray-600">
              Sección {currentSection + 1} de {auditSections.length}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{Math.round(progress)}% completado</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentQuestions.title}
            </h2>
            <p className="text-gray-600">{currentQuestions.subtitle}</p>
          </div>

          <div className="space-y-8">
            {currentQuestions.questions.map((question, qIndex) => (
              <div key={question.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {qIndex + 1}. {question.question}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${answers[question.id] === option.points
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${answers[question.id] === option.points
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                        }`}>
                        {answers[question.id] === option.points && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <span className="text-gray-900 flex-1">{option.text}</span>
                      <span className="text-sm font-medium text-blue-600">
                        {option.points} pts
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="mr-2" size={18} />
              Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentSection === auditSections.length - 1 ? (
                <>
                  Ver Resultados
                  <span className="ml-2">🎉</span>
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="ml-2" size={18} />
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