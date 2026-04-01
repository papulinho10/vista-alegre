
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LOGO_URL, ADDRESS, ADDRESS_SUB, ADDRESS_2, ADDRESS_SUB_2, WHATSAPP_NUMBER, INSTAGRAM_HANDLE, INSTAGRAM_URL, MAP_URL } from '../constants';

// --- Componente de Imagem com Fade-In Suave ---
const FadeImage: React.FC<{ src: string; alt: string; className?: string; priority?: boolean }> = ({ src, alt, className, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Pré-carrega a imagem na memória
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${className} img-transition ${isLoaded ? 'img-loaded' : 'img-loading'}`}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
    />
  );
};

// --- Componente Interno para o Card de Avaliação ---
const ReviewCard: React.FC<{ name: string; text: string }> = ({ name, text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200; 
  const shouldTruncate = text.length > maxLength;

  return (
    <div className="bg-wine-dark/30 backdrop-blur-sm p-8 rounded-[2rem] border border-white/5 flex flex-col items-start space-y-4 shadow-lg hover:bg-wine-dark/50 transition-all duration-500 group h-full">
      <div className="flex gap-1 text-gold">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
      
      <div className="flex-grow">
        <p className="text-ivory/70 font-light leading-relaxed text-sm md:text-base">
          <span className="text-gold text-2xl leading-none mr-2 font-serif">"</span>
          {isExpanded || !shouldTruncate ? text : `${text.slice(0, maxLength)}...`}
        </p>
      </div>

      <div className="w-full pt-4 border-t border-white/5 flex flex-col items-start gap-2">
        <h4 className="font-serif text-xl text-ivory font-bold">{name}</h4>
        
        {shouldTruncate && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold hover:text-white transition-colors flex items-center gap-1 mt-2"
          >
            {isExpanded ? 'Ler menos' : 'Ler mais'}
            <svg 
              className={`w-3 h-3 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

const reviewsData = [
  {
    name: "Polly Almeida",
    text: "Fui super bem recebida na Adega Vista Alegre! O atendimento feito pelo Nemias foi excepcional — atencioso, educado e muito prestativo. Tive degustações deliciosas de geleias, salames (inclusive o de carne de javali), além de vinhos e sucos da Serra Gaúcha. O local oferece uma variedade incrível de produtos artesanais de produtores locais, todos de excelente qualidade. Ambiente acolhedor, experiência completa e atendimento impecável. Super recomendo a visita! 🍷🧀✨"
  },
  {
    name: "Felipe Rocha",
    text: "A Vinícola Vista Alegre oferece uma experiência completa, acolhedora e cheia de sabor. A degustação de queijos e vinhos é um verdadeiro destaque: rótulos de excelente qualidade harmonizados com queijos deliciosos, tudo apresentado com atenção e conhecimento pelos anfitriões. O ambiente é agradável, organizado e transmite a autenticidade da produção local. Outro diferencial é a variedade de produtos à venda, incluindo lâminas, couros e facas artesanais — itens belíssimos e de ótima qualidade, que dão um charme extra à visita. Um passeio que combina tradição, gastronomia e cultura gaúcha de forma impecável. Vale muito a pena conhecer!"
  },
  {
    name: "Fernanda Medeiro",
    text: "De todas as degustações que já participei, essa foi, sem dúvida, a melhor. Os atendentes foram extremamente atenciosos e não mediram esforços para agradar o grupo em que eu estava. Queijos e vinhos de excelente qualidade, servidos à vontade, em um ambiente acolhedor e bem organizado. Um grande diferencial é que não há qualquer pressão para comprar…o que torna a experiência ainda mais agradável. Curiosamente, justamente por serem produtos tão saborosos e de alta qualidade, as pessoas acabam comprando espontaneamente. Uma experiência que recomendo!"
  }
];

const Home: React.FC = () => {
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal
  const GOOGLE_REVIEWS_URL = "https://g.page/r/CSAxSwBBxwduEAE/review";

  useEffect(() => {
    if (location.state && (location.state as any).targetId) {
      const targetId = (location.state as any).targetId;
      const section = document.getElementById(targetId);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (location.state && (location.state as any).scrollToContact) {
       const contactSection = document.getElementById('contato');
       if (contactSection) {
         setTimeout(() => {
           contactSection.scrollIntoView({ behavior: 'smooth' });
         }, 100);
       }
    }
  }, [location]);

  // Efeito para sincronizar estado se o vídeo pausar/tocar por outros meios (ex: navegador pausando)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);


  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique no botão de mute pause o vídeo
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Abre o Modal e Pausa o vídeo de fundo para não ter dois áudios
  const openVideoModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col bg-wine-black">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden py-24 bg-wine-black">
        <div className="absolute inset-0 z-0 bg-wine-black">
            {/* Imagem de Fundo com Fade-In */}
            <FadeImage 
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1920" 
              className="w-full h-full object-cover opacity-30" 
              alt="Wine Background"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-wine-black/50 via-wine-black/20 to-wine-black" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="mb-0 relative group animate-fade-in">
            <div className="relative h-56 w-56 md:h-80 md:w-80 p-0 bg-transparent rounded-full overflow-hidden transform hover:scale-105 transition-transform duration-700 flex items-center justify-center">
              {/* Logo com Fade-In */}
              <FadeImage 
                src={LOGO_URL} 
                alt="Vista Alegre" 
                className="w-full h-full object-contain"
                priority={true}
              />
            </div>
          </div>
          
          <h1 className="font-serif text-4xl md:text-7xl text-ivory mb-8 font-light leading-tight tracking-tight italic">
            Viva Sua <br/> <span className="text-gold">Melhor Safra</span>
          </h1>
          
          <Link 
            to="/vinhos" 
            className="bg-wine hover:bg-wine-light text-white px-10 py-4 rounded-full font-bold uppercase tracking-[0.3em] text-[9px] transition-all duration-500 shadow-[0_10px_40px_rgba(94,25,20,0.6)] border border-white/5"
          >
            Conheça nossos vinhos
          </Link>
        </div>
      </section>

      {/* --- Seção de Experiência de Degustação --- */}
      <section id="convite" className="py-24 px-6 bg-gradient-to-b from-[#0F0404] to-[#2D090E] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-wine/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          {/* Bloco de Avaliação para visitantes */}
          <div className="bg-wine-dark/30 backdrop-blur-sm border border-gold/20 rounded-[2rem] p-8 md:p-10 mb-16 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <div className="relative z-10 flex flex-col items-center space-y-4">
                <h3 className="font-serif text-2xl md:text-3xl text-ivory">Já nos visitou?</h3>
                <p className="text-ivory/70 font-light text-sm md:text-base max-w-lg mx-auto">
                  Sua opinião é muito importante para nós! Deixe seu feedback e nos ajude a continuar oferecendo a melhor experiência na Serra Gaúcha.
                </p>
                <div className="pt-4">
                   <button
                     onClick={() => window.open(GOOGLE_REVIEWS_URL, '_blank')}
                     className="text-xs md:text-sm font-bold uppercase tracking-widest text-gold hover:text-white border border-gold/30 hover:border-white/50 px-8 py-4 rounded-full transition-all flex items-center gap-3 hover:bg-white/5 group/btn bg-black/20"
                   >
                      <div className="w-5 h-5 relative flex items-center justify-center">
                         <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                         </svg>
                      </div>
                      NOS AVALIE NO GOOGLE
                      <svg className="w-4 h-4 text-gold/50 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                   </button>
                </div>
             </div>
          </div>

          <span className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] animate-pulse">
             Convite Especial
          </span>

          <h2 className="font-serif text-3xl md:text-5xl text-ivory leading-tight">
            A experiência de degustação mais <br/>
            <span className="italic text-gold">exclusiva</span> de Gramado
          </h2>

          <p className="text-xl md:text-2xl text-ivory/90 font-light italic">
            "Descubra sabores únicos em um ambiente acolhedor. Vinhos selecionados, atendimento especializado e uma experiência que vai além da degustação."
          </p>

          <div className="w-24 h-px bg-gold/30 mx-auto my-6" />

          <p className="text-ivory/60 leading-relaxed font-light text-lg max-w-2xl mx-auto">
            Embarque em uma jornada sensorial única no coração de Gramado. Nossa degustação premium oferece vinhos selecionados e harmonizações exclusivas. Devido à alta demanda, recomendamos que você agende sua visita com antecedência para garantir um atendimento especial.
          </p>

          <div className="pt-8">
            <button
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de agendar uma degustação na Adega Vista Alegre.`, '_blank')}
              className="bg-[#22C55E] hover:bg-[#1fa851] text-white px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-[0_10px_40px_rgba(34,197,94,0.2)] hover:-translate-y-1 flex items-center gap-3 mx-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.672 1.433 5.661 1.433h.05c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Garanta sua visita agora
            </button>
          </div>
        </div>
      </section>

      {/* Intro Section - VIDEO COM CONTROLE MANUAL */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#2D090E] to-wine-black overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="w-full md:w-1/2 relative group">
             <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-gold/20" />
             
             {/* Container do Vídeo com Evento de Clique */}
             <div 
               className="aspect-[9/16] md:aspect-[3/4] overflow-hidden rounded-[40px] shadow-2xl border border-white/5 bg-wine-dark/20 relative group/video cursor-pointer"
               onClick={togglePlay}
             >
                <video 
                  ref={videoRef}
                  src="https://files.catbox.moe/5nq54t.mp4" 
                  className="w-full h-full object-cover rounded-[40px]" 
                  poster="https://i.postimg.cc/Hnwpc4B2/Whats-App-Image-2026-01-25-at-14-28-08-(3).jpg"
                  muted // Começa mutado por segurança, usuário pode desmutar
                  playsInline
                  loop
                  preload="metadata" // Carrega apenas metadados inicial
                />
                
                {/* Overlay de Play (Aparece quando pausado) */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-500 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                   <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover/video:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M8 5v14l11-7z" />
                      </svg>
                   </div>
                </div>

                {/* Botão de Expandir Vídeo (Canto Superior Direito) */}
                <button 
                  onClick={openVideoModal}
                  className="absolute top-6 right-6 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-wine transition-all duration-300 border border-white/10 z-20 group/btn"
                  aria-label="Ver vídeo completo"
                >
                  <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>

                {/* Botão de Mute/Unmute (Canto Inferior) */}
                <button 
                  onClick={toggleMute}
                  className="absolute bottom-6 right-6 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-wine transition-all duration-300 border border-white/10 z-20"
                  aria-label={isMuted ? "Ativar som" : "Desativar som"}
                >
                  {isMuted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
             </div>
          </div>
          <div className="w-full md:w-1/2 space-y-10">
            <span className="text-gold font-bold uppercase tracking-[0.5em] text-[10px]">A Arte do Terroir</span>
            <h2 className="font-serif text-5xl md:text-7xl text-ivory leading-tight">
              Onde cada taça <br/> conta uma história.
            </h2>
            <p className="text-ivory/60 leading-relaxed font-light text-lg max-w-lg">
              A Vista Alegre, em Gramado, reúne o melhor dos sabores da Serra Gaúcha em um só lugar. Vinhos selecionados, queijos coloniais, embutidos, geleias artesanais, cachaças e facas especiais fazem parte de uma curadoria pensada para quem valoriza qualidade, tradição e experiências únicas. Um espaço acolhedor para degustar, presentear e levar para casa produtos que transformam momentos em boas memórias.
            </p>
            <div className="pt-6">
                <Link to="/vinhos" className="text-gold font-bold uppercase tracking-[0.2em] text-xs border-b-2 border-gold/30 pb-3 hover:border-gold hover:text-ivory transition-all">
                  Nossos Produtos
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE VÍDEO (LIGHTBOX) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Botão Fechar Modal */}
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 z-[110] w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-wine transition-colors border border-white/20"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>

          <div 
            className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Impede fechamento ao clicar no vídeo
          >
             <video 
               src="https://files.catbox.moe/5nq54t.mp4"
               className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl outline-none"
               controls
               autoPlay
               controlsList="nodownload" // Remove o botão de download
               onContextMenu={(e) => e.preventDefault()} // Desabilita o clique direito
             />
          </div>
        </div>
      )}

      {/* Seção Parada Perfeita */}
      <section className="py-24 px-6 bg-[#0F0404] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-wine/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16 md:gap-24">
          
          <div className="w-full md:w-1/2 space-y-8">
            <div className="space-y-2">
              <span className="text-gold font-bold uppercase tracking-[0.4em] text-[10px]">Localização Privilegiada</span>
              <h2 className="font-serif text-4xl md:text-6xl text-ivory leading-none">
                Uma Parada Perfeita <br/> 
                <span className="text-white/30 italic">Durante o Passeio</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-ivory/70 font-light leading-relaxed">
              <p>
                A Vista Alegre está localizada em pontos estratégicos de Gramado, dentro do Parque dos Bondinhos e na avenida principal, próxima a atrações turísticas como museus e o Super Carros, integrando-se naturalmente ao roteiro da cidade.
              </p>
              <p>
                É o lugar ideal para fazer uma pausa, degustar um bom vinho, saborear produtos da serra e relaxar em um ambiente acolhedor, transformando a visita em um momento agradável e memorável.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
             <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 group">
                <div className="absolute inset-0 bg-wine-dark/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <FadeImage 
                  src="https://i.postimg.cc/5t2yqCPK/imagem-para-site.jpg" 
                  alt="Vista panorâmica da Serra Gaúcha com tábua de frios e vinho" 
                  className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[1.5s]"
                />
             </div>
             <div className="absolute -bottom-6 -left-6 bg-wine-dark border border-white/10 p-6 rounded-2xl shadow-xl z-20 hidden md:block">
                <span className="block text-gold text-2xl font-serif font-bold">Gramado</span>
                <span className="block text-ivory/60 text-xs uppercase tracking-widest mt-1">Serra Gaúcha</span>
             </div>
          </div>

        </div>
      </section>

      {/* Seção de Experiência e Autoridade (NOVA) */}
      <section className="py-24 px-6 bg-[#0F0404] relative border-t border-white/5">
        <div className="absolute inset-0 bg-wine-dark/20" /> {/* Slight tint */}
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Texto de Experiência e Botão CTA */}
            <div className="space-y-6 mb-16">
                <span className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] block mb-6 animate-pulse">Nossa Essência</span>
                <h2 className="font-serif text-3xl md:text-5xl text-ivory leading-tight">
                    Viva uma experiência exclusiva de <br/>
                    <span className="text-gold">degustação de vinhos</span> em Gramado
                </h2>
                
                <p className="text-lg md:text-xl text-ivory/70 font-light max-w-2xl mx-auto">
                    Uma experiência sensorial premium para quem aprecia vinhos e bons momentos. 
                    Agende sua visita e tenha um atendimento personalizado.
                </p>

                <div className="pt-8">
                     <button
                      onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de agendar uma experiência de degustação.`, '_blank')}
                      className="bg-[#22C55E] hover:bg-[#1fa851] text-white px-10 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-[0_10px_40px_rgba(34,197,94,0.2)] hover:-translate-y-1 flex items-center gap-3 mx-auto"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.672 1.433 5.661 1.433h.05c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Agendar experiência no WhatsApp
                    </button>
                </div>
            </div>

            {/* Novo Bloco de Citação Estilizado */}
            <div className="max-w-4xl mx-auto text-left relative group">
               {/* Gradient Border/Glow Effect */}
               <div className="absolute -inset-[1px] bg-gradient-to-r from-gold/30 to-transparent rounded-r-[2rem] blur-sm opacity-50 group-hover:opacity-100 transition duration-700"></div>

               <div className="relative bg-[#150505] border-l-[6px] border-gold p-8 md:p-12 rounded-r-[2rem] shadow-2xl flex flex-col md:flex-row gap-6 items-start md:items-center transform transition-transform duration-500 hover:scale-[1.01]">
                 <div className="shrink-0">
                    <svg className="w-12 h-12 text-gold opacity-80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
                    </svg>
                 </div>
                 <div>
                    <p className="font-serif text-xl md:text-2xl text-ivory italic leading-relaxed">
                      "Mais do que uma loja, criamos um espaço para quem aprecia vinhos, experiências e momentos memoráveis."
                    </p>
                    <span className="block mt-4 text-gold text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                      — Vista Alegre
                    </span>
                 </div>
               </div>
            </div>
        </div>
      </section>

      {/* Avaliações dos Clientes */}
      <section id="depoimentos" className="py-24 px-6 bg-[#0B0303] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
             <span className="text-gold font-bold uppercase tracking-[0.4em] text-[10px]">Depoimentos</span>
             <h2 className="font-serif text-4xl md:text-5xl text-ivory font-light leading-tight">
               Veja o que nossos clientes <br className="hidden md:block" /> dizem sobre nós
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviewsData.map((review, index) => (
              <ReviewCard key={index} name={review.name} text={review.text} />
            ))}
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-center animate-fade-in">
             <p className="text-ivory/50 text-xs md:text-sm font-light flex items-center gap-2 bg-wine-dark/30 px-4 py-2 rounded-full border border-white/5">
                <svg className="w-4 h-4 text-[#34A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Avaliações reais de clientes verificados no Google
             </p>
             <button
               onClick={() => window.open(GOOGLE_REVIEWS_URL, '_blank')}
               className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-white border border-gold/30 hover:border-white/50 px-6 py-3 rounded-full transition-all flex items-center gap-3 hover:bg-white/5 group"
             >
                <div className="w-4 h-4 relative flex items-center justify-center">
                   <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                   </svg>
                </div>
                Conferir no Google
                <svg className="w-3 h-3 text-gold/50 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
             </button>
          </div>

        </div>
      </section>

      {/* Seção de Contato */}
      <section id="contato" className="py-24 px-6 bg-[#0B0303] text-white scroll-mt-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-serif mb-6 text-ivory font-light">Entre em Contato</h2>
          <p className="text-white/40 mb-16 text-lg max-w-2xl mx-auto font-light">
            Reserve sua experiência exclusiva em nossa adega e descubra sabores inesquecíveis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-wine-dark/40 p-12 rounded-[2.5rem] border border-white/5 flex flex-col items-center space-y-6 transition-all hover:bg-wine-dark/60 hover:-translate-y-2 shadow-lg">
              <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98 1 4.29L1.81 21.3a1 1 0 001.29 1.29L8.41 21c1.31.64 2.75 1 4.29 1 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-ivory">WhatsApp</h3>
              <p className="text-xl font-bold text-ivory/90">(54) 99684-4704</p>
              <button 
                onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                className="bg-[#22C55E] text-white px-10 py-3 rounded-full flex items-center gap-2 hover:brightness-110 transition-all font-bold uppercase tracking-widest text-[10px] shadow-lg"
              >
                Conversar Agora
              </button>
            </div>

            <div className="bg-wine-dark/40 p-12 rounded-[2.5rem] border border-white/5 flex flex-col items-center space-y-6 transition-all hover:bg-wine-dark/60 hover:-translate-y-2 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(238,42,123,0.3)]">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M19,5A1,1 0 0,1 20,6A1,1 0 0,1 19,7A1,1 0 0,1 18,6A1,1 0 0,1 19,5Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-ivory">Instagram</h3>
              <p className="text-xl font-bold text-ivory/90">{INSTAGRAM_HANDLE}</p>
              <button 
                onClick={() => window.open(INSTAGRAM_URL, '_blank')}
                className="bg-gradient-to-r from-[#833ab4] to-[#fd1d1d] text-white px-10 py-3 rounded-full flex items-center gap-2 hover:brightness-110 transition-all font-bold uppercase tracking-widest text-[10px] shadow-lg"
              >
                Seguir Perfil
              </button>
            </div>

            <div className="bg-wine-dark/40 p-12 rounded-[2.5rem] border border-white/5 flex flex-col items-center space-y-6 transition-all hover:bg-wine-dark/60 hover:-translate-y-2 shadow-lg">
              <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-ivory">Nossas Lojas</h3>
              
              <div className="flex flex-col gap-4 w-full px-2">
                <div className="text-center">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest block mb-1">Gramado</span>
                    <p className="text-lg font-bold text-ivory/90 leading-tight">{ADDRESS}</p>
                </div>
                <div className="w-12 h-px bg-white/10 mx-auto"></div>
                <div className="text-center">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest block mb-1">Canela</span>
                    <p className="text-lg font-bold text-ivory/90 leading-tight">{ADDRESS_2}</p>
                </div>
              </div>

              <button 
                onClick={() => window.open(`https://maps.google.com/?q=${ADDRESS}`, '_blank')}
                className="bg-[#3B82F6] text-white px-10 py-3 rounded-full flex items-center gap-2 hover:brightness-110 transition-all font-bold uppercase tracking-widest text-[10px] shadow-lg mt-2"
              >
                Ver no Mapa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Nossa Localização - Mapa Colorido */}
      <section className="py-24 px-6 bg-[#0B0303] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-ivory font-light italic">Nossa Localização</h2>
          <p className="text-white/40 mb-16 text-lg max-w-3xl mx-auto font-light">
            No coração de Gramado, um endereço que é sinônimo de sofisticação e acessibilidade.
          </p>

          <div className="w-full h-[500px] rounded-none overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 bg-wine-dark/20 relative group">
             <iframe 
                src={MAP_URL}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
             ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
