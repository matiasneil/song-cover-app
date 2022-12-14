import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Search.module.css";

function Search(props) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchEndpoint = (query) =>
    `	https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`;

  const onChange = useCallback((event) => {
    const query = event.target.value;
    setQuery(query);
  }, []);

  const onKeyDown = useCallback((event) => {
    if (event.key === "Enter") {
      doSearch();
    }
  });

  const onClick = useCallback((event) => {
    doSearch();
  });

  const doSearch = () => {
    if (query.length) {
      setLoading(true);
      fetch(searchEndpoint(query), {
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setResults(res.tracks.items);
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    results.length !== 0 || loading
      ? props.setResultsShowing(true)
      : props.setResultsShowing(false);
  }, [results, loading]);

  return (
    <>
      <div className="columns mb-3">
        <div className="column is-four-fifths">
          <input
            className="input"
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={props.placeholder}
            type="text"
            value={query}
          />
        </div>
        <div className="column">
          <button
            className="button is-fullwidth is-info is-light"
            onClick={onClick}
          >
            {props.buttonLabel}
          </button>
        </div>
      </div>
      {!loading && results.length > 0 && (
        <div className={styles.resultsContainer}>
          {results.map((result) => (
            <div
              key={result.id}
              className={`${styles.buttonBox} box is-flex is-flex-direction-row is-align-items-center`}
              onClick={() => {
                setLoading(true);
                router.push({
                  pathname: "/create",
                  query: { data: JSON.stringify(result) },
                });
              }}
            >
              <img
                src={result.album.images[2].url}
                width={result.album.images[2].width}
                className="mr-3"
                height={result.album.images[2].height}
              ></img>
              <div className="is-flex is-flex-direction-column">
                <span>{result.name}</span>
                <span>{result.album.name}</span>
                <span>{result.artists[0].name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {loading && (
        <progress className="progress is-small is-info" max="100">
          15%
        </progress>
      )}
    </>
  );
}

export default Search;
