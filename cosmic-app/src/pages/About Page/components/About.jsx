import style from "../styles/About.module.scss";

export function About() {
  return (
    <main>
      <div className={style.introduction}>
        <img className={style.logo} src="src/assets/cosmic-logo.svg"></img>
        <h1>An interactive web application with a purpose to educate and bring fun</h1>
      </div>
      <section className={style.authors}>
        <h2>Authors</h2>
        <div className={style.authorsContainer}>
          <div className={style.author}>
            <img src="" alt="" />
            <h3>Mateusz Boboryko</h3>
            <p>Brief decs: CDV student intersedted in video games and visual media etc.</p>
          </div>
          <div className={style.author}>
            <img src="" alt="" />
            <h3>Bruno Mikołajczak</h3>
            <p>Brief decs: CDV student intersedted in photography and stuff etc.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
