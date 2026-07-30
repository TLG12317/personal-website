import tatami from "../assets/tatami.jpg";
import tatami1 from "../assets/tatami1.jpg";
import tatami2 from "../assets/tatami2.jpg";
import fog3 from "../assets/fog3.jpg";

export default function Intro({
  display = "WELCOME.",
  onFinish,
}) {
  return (
    <section className="intro">

      <img
        src={tatami}
        className="background"
        alt=""
        draggable={false}
      />

      <img
        src={tatami1}
        className="background1"
        alt=""
        draggable={false}
      />

      <img
        src={tatami2}
        className="background2"
        alt=""
        draggable={false}
      />

      <img
        src={fog3}
        className="fog fog3"
        alt=""
        draggable={false}
        onAnimationEnd={onFinish}
      />

      <div className="content">
        <h1>{display}</h1>
      </div>

    </section>
  );
}