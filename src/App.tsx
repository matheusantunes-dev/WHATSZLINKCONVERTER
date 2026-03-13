import { FormEvent, useEffect, useMemo, useState } from 'react';

type ModalKey = 'privacidade' | 'termos' | 'cookies' | 'faq' | 'tutoriais';

const modals: Record<ModalKey, { title: string; content: JSX.Element }> = {
  privacidade: {
    title: 'Política de Privacidade',
    content: (
      <>
        <p>No LinkWhatsApp, levamos sua privacidade muito a sério. Esta política explica como coletamos, usamos e protegemos suas informações.</p>
        <h4>Coleta de Dados</h4>
        <p>Não coletamos, armazenamos ou processamos nenhum dado pessoal. Todo o processamento é feito localmente no seu navegador.</p>
        <h4>Informações de Uso</h4>
        <p>Utilizamos apenas dados anônimos de analytics para melhorar nossa ferramenta. Nenhuma informação pessoal é compartilhada.</p>
        <h4>Contato</h4>
        <p>Dúvidas sobre privacidade? Entre em contato via WhatsApp: (38) 98806-4942.</p>
      </>
    ),
  },
  termos: {
    title: 'Termos de Uso',
    content: (
      <>
        <p>Ao usar o LinkWhatsApp, você concorda com estes termos de uso. Leia com atenção.</p>
        <h4>Uso Permitido</h4>
        <p>Você pode usar nossa ferramenta gratuitamente para fins pessoais e comerciais legítimos.</p>
        <h4>Restrições</h4>
        <p>Não é permitido usar a ferramenta para spam, atividades ilegais ou que violem direitos de terceiros.</p>
        <h4>Isenção de Responsabilidade</h4>
        <p>Não nos responsabilizamos pelo uso indevido dos links gerados através de nossa plataforma.</p>
      </>
    ),
  },
  cookies: {
    title: 'Política de Cookies',
    content: (
      <>
        <p>Utilizamos cookies essenciais para garantir o funcionamento adequado da ferramenta.</p>
        <h4>Cookies Essenciais</h4>
        <p>Cookies técnicos necessários para o funcionamento básico do site.</p>
        <h4>Analytics</h4>
        <p>Cookies anônimos para entender como os usuários interagem com nossa ferramenta.</p>
      </>
    ),
  },
  faq: {
    title: 'Perguntas Frequentes',
    content: (
      <>
        <h4>Como usar a ferramenta?</h4>
        <p>Basta inserir o DDI, número do WhatsApp e mensagem opcional. Clique em "Gerar link" e pronto!</p>
        <h4>É gratuito?</h4>
        <p>Sim! Nossa ferramenta é 100% gratuita e sempre será.</p>
        <h4>Preciso me cadastrar?</h4>
        <p>Não! Use quantas vezes quiser sem cadastro ou login.</p>
      </>
    ),
  },
  tutoriais: {
    title: 'Tutoriais',
    content: (
      <>
        <p>Aprenda a usar todas as funcionalidades do LinkWhatsApp como um profissional.</p>
        <h4>Passo a Passo Básico</h4>
        <ol>
          <li>Insira o código do país (DDI)</li>
          <li>Digite o número do WhatsApp (apenas números)</li>
          <li>Adicione uma mensagem pré-definida (opcional)</li>
          <li>Clique em "Gerar link"</li>
          <li>Use os botões para copiar, abrir ou compartilhar</li>
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
  const [copyText, setCopyText] = useState('Copiar Link');

  const showResult = useMemo(() => generatedLink.length > 0, [generatedLink]);

  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : 'auto';
  }, [activeModal]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ddi || !phone) {
      alert('Por favor, preencha o DDI e o número do WhatsApp.');
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
    await navigator.clipboard.writeText(generatedLink);
    setCopyText('Copiado!');
    window.setTimeout(() => setCopyText('Copiar Link'), 2000);
  };

  const shareLink = async () => {
    if (!generatedLink) return;

    if (navigator.share) {
      await navigator.share({
        title: 'Link de WhatsApp',
        text: 'Confira meu link direto para WhatsApp',
        url: generatedLink,
      });
      return;
    }

    alert('Compartilhamento não suportado neste navegador.');
  };

  return (
    <div className="app">
      <header className="header">
        <nav className="container nav">
          <div className="logo">LinkWhatsApp</div>
          <button className="nav-toggle" onClick={() => setMobileOpen((value) => !value)} aria-label="Abrir menu">
            ☰
          </button>
          <div className="nav-links desktop">
            <a href="#recursos">Recursos</a>
            <a href="#sobre">Sobre</a>
            <a href="#contato">Contato</a>
          </div>
        </nav>
        {mobileOpen && (
          <div className="container nav-links mobile">
            <a href="#recursos">Recursos</a>
            <a href="#sobre">Sobre</a>
            <a href="#contato">Contato</a>
          </div>
        )}
      </header>

      <main>
        <section className="hero container">
          <div className="card">
            <h1>Link Rápido do WhatsApp</h1>
            <p>Converta um número de telefone para link de WhatsApp em segundos.</p>

            <form onSubmit={handleSubmit} className="form">
              <label>
                DDI (código do país)
                <input value={ddi} onChange={(e) => setDdi(e.target.value.replace(/\D/g, ''))} placeholder="55" />
              </label>
              <label>
                Número do WhatsApp
                <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="11999999999" />
              </label>
              <label>
                Mensagem (opcional)
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
              </label>

              <div className="actions">
                <button type="submit" className="btn primary">Gerar Link</button>
                <button type="button" className="btn secondary" onClick={clearForm}>Limpar</button>
              </div>
            </form>

            {showResult && (
              <div className="result">
                <h3>Link gerado</h3>
                <input value={generatedLink} readOnly />
                <div className="actions">
                  <button type="button" className="btn secondary" onClick={copyLink}>{copyText}</button>
                  <a className="btn primary" href={generatedLink} target="_blank" rel="noreferrer">Ir para WhatsApp</a>
                  <button type="button" className="btn secondary" onClick={shareLink}>Compartilhar</button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="recursos" className="section container">
          <h2>Recursos Incríveis</h2>
          <div className="grid-3">
            <article><h3>Geração Instantânea</h3><p>Crie links do WhatsApp em segundos com fluxo simples.</p></article>
            <article><h3>100% Seguro</h3><p>Os dados ficam no seu navegador, sem armazenamento em servidor.</p></article>
            <article><h3>Responsivo</h3><p>Experiência otimizada para celular, tablet e desktop.</p></article>
          </div>
        </section>

        <section id="sobre" className="section section-alt container">
          <h2>Sobre o LinkWhatsApp</h2>
          <p>Criamos o LinkWhatsApp para simplificar a comunicação digital de profissionais, empresas e pessoas.</p>
        </section>

        <section id="contato" className="section container">
          <h2>Entre em Contato</h2>
          <p>Tem dúvidas? Fale com nosso suporte via WhatsApp.</p>
          <a className="btn primary" href="https://wa.me/5538988064942" target="_blank" rel="noreferrer">Chamar no WhatsApp</a>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h3>LinkWhatsApp</h3>
            <p>Ferramenta gratuita para criar links do WhatsApp instantaneamente.</p>
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
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <h3>{modals[activeModal].title}</h3>
              <button onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="modal-content">{modals[activeModal].content}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
