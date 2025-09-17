"use client";
import { useState, useEffect, useMemo } from "react";
import "./page.css"
import Link from "next/link";
import tempData from "./temp-data/levels.json"
import dotenv from "dotenv";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env['NEXT_PUBLIC_API_URL'];
      // const res = await fetch(`${apiUrl}/sonolus/levels/list/`);
      const res = await fetch(`${apiUrl}/api/charts/?type=random`);
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      const data = await res.json();

      // const data = tempData;
      const BASE = `${apiUrl}`;
      const items = Array.isArray(data?.items) ? data.items : [];

      // console.log(`${apiUrl}`)

      const normalized = items.map((item) => ({
        id: item.name,
        title: item.title,
        artists: item.artists,
        author: item.author,
        rating: item.rating,
        coverUrl: item.cover ? BASE + item.cover.url : "",
        bgmUrl: item.bgm ? BASE + item.bgm.url : "",
      }));

      
      setPosts(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }  
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
    [p.title, p.artists, p.author].some((field) => 
    field?.toLowerCase().includes(q)
  )
  );
  }, [posts, query]);

    const visiblePosts = useMemo(() => {
    const arr = [...filtered];
    if (sort === "newest") {
      arr.sort((a, b) => a.order - b.order);
    } else if (sort === "abc") {
      arr.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
    } else if (sort === "level-asc") {
      arr.sort((a, b) => a.rating - b.rating);
    }
    return arr;
  }, [filtered, sort]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <main>
        

        <div className="songcontainer">
          <div className="searchContainer">
            <input
            className="search-bar"
            type="search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
            <fieldset className="sort-group">
              <legend className="sr-only">Sort by</legend>

              <label>
                <input
                  type="radio"
                  name="sort"
                  value="newest"
                  checked={sort === "newest"}
                  onChange={() => setSort("newest")}
                  />{" "}
                  Newest
              </label>

              <label>
                <input
                  type="radio"
                  name="sort"
                  value="abc"
                  checked={sort === "abc"}
                  onChange={() => setSort("abc")}
                  />{" "}
                  ABC
              </label>

              <label>
                <input
                  type="radio"
                  name="sort"
                  value="level-asc"
                  checked={sort === "level-asc"}
                  onChange={() => setSort("level-asc")}
                  />{" "}
                  Level
              </label>
            </fieldset>
            
          </div>
          <ul className="songlist">
            {visiblePosts.map((post) => (
              <Link key={post.id} href={`/levels/${post.id}`}>
              <li>
                <img className="levels-img" src={post.coverUrl} alt={post.title} />
                <div>
                  <span className="song-title">{post.title.length > 19 ? post.title.substring(0, 19) + "..." : post.title}</span><br />
                  <span className="song-artist">{post.artists.length > 20 ? post.artists.substring(0, 20) + "..." : post.artists}</span><br />
                  <span className="charter"><p>Charted by</p> <span>{post.author}</span></span><br />
                  <span className="rating">Lv.{post.rating}</span>
                  
                </div>
              </li>
              </Link>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
