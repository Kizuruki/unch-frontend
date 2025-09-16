import "./page.css"
const BASE = "https://sonolus.untitledcharts.com";
const APILink = process.env.LEVELAPI;

export default async function LevelPage({ params }) {
  const { id } = params;

  const res = await fetch(`${APILink}/sonolus/levels/list/`, {
    cache: "no-store",
  });
  const data = await res.json();

  const item = (data.items || []).find((x) => x.name === id);
  if (!item) {
    return <p>Level not found</p>;
  }

  const coverUrl = item.cover ? BASE + item.cover.url : "";
  const bgmUrl = item.bgm ? BASE + item.bgm.url : "";

  const checkENV = () =>{
    console.log(`${APILink}`);
  }

  checkENV();

  return (
    <main>
      <div className="detail-container">
        <h1>{item.title}</h1>
        <span><p className="label">Artists</p><p className="item">{item.artists}</p></span>
        <span><p className="label">Charter</p><p className="item">{item.author}</p></span>
        <span><p className="label">Level</p><p className="item">{item.rating}</p></span>
      </div>
      <div className="media-container">
        {coverUrl && <img className="level-detail-img" src={coverUrl} alt={item.title} />}
        {bgmUrl && (
          <audio controls>
            <source src={bgmUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        )}
      </div>
    </main>
  );
}
