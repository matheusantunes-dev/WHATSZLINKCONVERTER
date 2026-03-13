import { FormEvent, useEffect, useMemo, useState } from 'react';

type ModalKey = 'privacidade' | 'termos' | 'cookies' | 'faq' | 'tutoriais';

type ModalInfo = {
  title: string;
  body: JSX.Element;
};

const modalContent: Record<ModalKey, ModalInfo> = {
  privacidade: {
    title: 'Política de Privacidade',
    body: (
      <>
        <p>No LinkWhatsApp, levamos sua privacidade muito a sério.</p>
        <h4>Coleta de Dados</h4>
        <p>Não coletamos dados pessoais. O processamento é local, no navegador.</p>
        <h4>Informações de Uso</h4>
        <p>Podemos usar métricas anônimas para melhoria contínua.</p>
      </>
    ),
  },
  termos: {
    title: 'Termos de Uso',
    body: (
      <>
        <p>Ao usar o LinkWhatsApp, você concorda com estes termos.</p>
        <h4>Uso Permitido</h4>
        <p>Uso gratuito para fins legítimos pessoais e comerciais.</p>
        <h4>Restrições</h4>
        <p>Não use para spam, golpes ou violações legais.</p>
      </>
    ),
  },
  cookies: {
    title: 'Cookies',
    body: (
      <>
        <p>Utilizamos cookies essenciais para funcionamento do site.</p>
        <h4>Essenciais</h4>
        <p>Necessários para usabilidade e estabilidade da navegação.</p>
      </>
    ),
  },
  faq: {
    title: 'FAQ',
    body: (
      <>
        <h4>Como gerar o link?</h4>
        <p>Preencha DDI e número, opcionalmente uma mensagem, e clique em Gerar.</p>
        <h4>É grátis?</h4>
        <p>Sim, totalmente gratuito.</p>
      </>
    ),
  },
  tutoriais: {
    title: 'Tutoriais',
    body: (
      <>
        <p>Fluxo básico:</p>
        <ol>
          <li>Informe o DDI</li>
          <li>Digite o número</li>
          <li>Adicione mensagem opcional</li>
          <li>Gere, copie e compartilhe</li>
        </ol>
      </>
    ),
  },
};

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ddi, setDdi] = useState('55');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);
  const [copyLabel, setCopyLabel] = useState('Copiar link');

  const hasLink = useMemo(() => Boolean(generatedLink), [generatedLink]);

  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeModal]);

  const generateLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ddi.trim() || !phone.trim()) {
      alert('Preencha DDI e número do WhatsApp.');
      return;
    }

    const cleanDDI = ddi.replace(/\D/g, '');
    const cleanPhone = phone.replace(/\D/g, '');

    let link = `https://wa.me/${cleanDDI}${cleanPhone}`;
    if (message.trim()) {
      link += `?text=${encodeURIComponent(message.trim())}`;
    }

    setGeneratedLink(link);
  };

  const clearForm = () => {
    setDdi('55');
    setPhone('');
    setMessage('');
    setGeneratedLink('');
  };

  const copyLink = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopyLabel('Copiado!');
      window.setTimeout(() => setCopyLabel('Copiar link'), 1800);
    } catch {
      alert('Não foi possível copiar automaticamente.');
    }
  };

  const share = async () => {
    if (!generatedLink) return;
    if (!navigator.share) {
      alert('Compartilhamento não suportado neste navegador.');
      return;
    }

    try {
      await navigator.share({
        title: 'Link WhatsApp',
        text: 'Link direto para conversa no WhatsApp',
        url: generatedLink,
      });
    } catch {
      // usuário cancelou
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="container nav-row">
          <a className="brand" href="#top">LinkWhatsApp</a>
          <button className="menu-btn" type="button" onClick={() => setMobileOpen((v) => !v)}>
            ☰
          </button>
          <nav className="nav desktop-nav">
            <a href="#recursos">Recursos</a>
            <a href="#sobre">Sobre</a>
            <a href="#contato">Contato</a>
          </nav>
        </div>
        {mobileOpen && (
          <nav className="container nav mobile-nav">
            <a href="#recursos">Recursos</a>
            <a href="#sobre">Sobre</a>
            <a href="#contato">Contato</a>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero container">
          <div className="panel">
            <h1>Link Rápido do WhatsApp</h1>
            <p>Converta números em links do WhatsApp em segundos.</p>

            <form className="form" onSubmit={generateLink}>
              <label>
                DDI (código do país)
                <input value={ddi} onChange={(e) => setDdi(e.target.value.replace(/\D/g, ''))} placeholder="55" />
              </label>

              <label>
                Número do WhatsApp
                <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="11999999999" />
              </label>

              <label>
                Mensagem opcional
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Olá! Gostaria de falar com você." />
              </label>

              <div className="actions">
                <button className="btn btn-primary" type="submit">Gerar link</button>
                <button className="btn btn-outline" type="button" onClick={clearForm}>Limpar</button>
              </div>
            </form>

            {hasLink && (
              <div className="result-box">
                <h3>Link gerado</h3>
                <input value={generatedLink} readOnly />
                <div className="actions">
                  <button className="btn btn-outline" type="button" onClick={copyLink}>{copyLabel}</button>
                  <a className="btn btn-primary" href={generatedLink} target="_blank" rel="noreferrer">Ir para WhatsApp</a>
                  <button className="btn btn-outline" type="button" onClick={share}>Compartilhar</button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="recursos" className="section container">
          <h2>Recursos Incríveis</h2>
          <div className="cards-3">
            <article><h3>Geração instantânea</h3><p>Crie links de conversa em poucos cliques.</p></article>
            <article><h3>Seguro</h3><p>Dados processados localmente no navegador.</p></article>
            <article><h3>Responsivo</h3><p>Experiência ótima no celular e no desktop.</p></article>
          </div>
        </section>

        <section id="sobre" className="section section-soft">
          <div className="container">
            <h2>Sobre o LinkWhatsApp</h2>
            <p>Ferramenta criada para simplificar comunicação digital, sem complexidade.</p>
          </div>
        </section>

        <section id="contato" className="section container">
          <h2>Entre em contato</h2>
          <p>Atendimento rápido pelo nosso WhatsApp.</p>
          <a className="btn btn-primary" href="https://wa.me/5538988064942" target="_blank" rel="noreferrer">
            Chamar no WhatsApp
          </a>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h3>LinkWhatsApp</h3>
            <p>Gerador gratuito de link para WhatsApp.</p>
          </div>

          <div>
            <h4>Legal</h4>
            <button onClick={() => setActiveModal('privacidade')}>Política de Privacidade</button>
            <button onClick={() => setActiveModal('termos')}>Termos de Uso</button>
            <button onClick={() => setActiveModal('cookies')}>Cookies</button>
          </div>

          <div>
            <h4>Suporte</h4>
            <button onClick={() => setActiveModal('faq')}>FAQ</button>
            <button onClick={() => setActiveModal('tutoriais')}>Tutoriais</button>
          </div>
        </div>
      </footer>

      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <article className="modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-head">
              <h3>{modalContent[activeModal].title}</h3>
              <button onClick={() => setActiveModal(null)}>✕</button>
            </header>
            <section className="modal-body">{modalContent[activeModal].body}</section>
          </article>
        </div>
      )}
    </div>
  );
}

export default App;
