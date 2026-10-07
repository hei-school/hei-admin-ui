import "./style/publicStudent.css";

export const PublicNotFound = () => (
  <div className="public-student">
    <header className="public-student__toolbar">
      <div className="public-student__toolbar-title">
        Haute École d'Informatique
      </div>
    </header>
    <main className="public-student__content">
      <div className="public-student__card public-student__not-found">
        <div className="public-student__not-found-code">404</div>
        <div className="public-student__not-found-title">Page introuvable</div>
        <p>La page que vous cherchez n'existe pas.</p>
        <a className="public-student__button" href="/">
          Retour à l'accueil
        </a>
      </div>
    </main>
  </div>
);
