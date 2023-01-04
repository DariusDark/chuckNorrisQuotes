import { useEffect, useState } from "react";
import "./App.css";
import { Loader } from "./Loader";

function App() {
  const [quote, setQuote] = useState("");
  const [timer, setTimer] = useState(null);
  const [loader, serLoader] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getRandomQuote(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const getRandomQuote = async (signal = undefined) => {
    try {
      serLoader(true);
      const response = await fetch("https://api.chucknorris.io/jokes/random", {
        signal,
      });
      const { value } = await response.json();
      setQuote(value);
    } catch (error) {
      console.log(error);
    } finally {
      serLoader(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        serLoader(true);
        const response = await fetch(
          "https://api.chucknorris.io/jokes/random",
          {
            signal: controller.signal,
          }
        );
        const { value } = await response.json();
        setQuote(value);
        setTimer(timeout);
      } catch (error) {
        console.log(error);
      } finally {
        serLoader(false);
      }
    }, 5 * 1000);
    return () => {
      console.log("work");
      controller.abort();
      clearTimeout(timeout);
    };
  }, [quote]);

  const timerCleaner = () => {
    getRandomQuote();
    clearTimeout(timer);
    setTimer(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="App">
      <div className="qoute-container">
        {quote ? (
          <h2 className="quote">{quote}</h2>
        ) : (
          <p className="quote">There is no quotes yet</p>
        )}
      </div>
      <form onClick={handleSubmit} className="form">
        {/* <input className="input" type="text" /> */}
        <button onClick={timerCleaner} className="button" type="submit">
          Another quote
        </button>
      </form>
      {loader ? <Loader /> : null}
    </div>
  );
}

export default App;
