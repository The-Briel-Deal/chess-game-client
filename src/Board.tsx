import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import "./App.css";

export default function Board() {
  const { isLoading, error, data, isFetching } = useQuery(
    ["repoData"],
    (): Promise<Number[][]> =>
      axios.get("http://localhost:8080/getBoard").then((res) => res.data)
  );
  return (
    <div style={{ display: "flex" }} className="App">
      {data?.map((row, rowIndex) => {
        return (
          <div style={{ flexDirection: "row" }}>
            {row.map((cell, cellIndex) => {
              return (
                <div
                  style={{
                    flexDirection: "column",
                    height: 50,
                    width: 50,
                    backgroundColor: `${
                      (rowIndex + cellIndex) % 2 != 0 ? "black" : "white"
                    }`,
                    color: `${
                      (rowIndex + cellIndex) % 2 != 0 ? "white" : "black"
                    }`,
                  }}
                >
                  {cell.toString()}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
