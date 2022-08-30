import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import "./App.css";

export default function Board() {
  const { isLoading, error, data, isFetching } = useQuery(
    ["getBoard"],
    (): Promise<Number[][]> =>
      axios.get("http://localhost:8080/getBoard").then((res) => res.data)
  );
  const [toMove, setToMove] = React.useState<{
    rowOne: null | number;
    colOne: null | number;
    rowTwo: null | number;
    colTwo: null | number;
  }>({
    rowOne: null,
    colOne: null,
    rowTwo: null,
    colTwo: null,
  });
  const mutation = useMutation(
    (positions: {
      rowOne: Number;
      colOne: Number;
      rowTwo: Number;
      colTwo: Number;
    }) =>
      axios
        .post("http://localhost:8080/swapPiece", positions)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getBoard"]);
      },
    }
  );
  useEffect(() => {
    const { rowOne, colOne, rowTwo, colTwo } = toMove;
    if (
      rowOne !== null &&
      colOne !== null &&
      rowTwo !== null &&
      colTwo !== null
    ) {
      mutation.mutate({ rowOne, colOne, rowTwo, colTwo });
      setToMove({
        rowOne: null,
        colOne: null,
        rowTwo: null,
        colTwo: null,
      });
    }
  }, [toMove]);
  function selectPiece(row: number, col: number) {
    if (toMove.rowOne === null || toMove.colOne === null) {
      setToMove({
        ...toMove,
        rowOne: row,
        colOne: col,
      });
    } else if (toMove.rowTwo === null || toMove.colTwo === null) {
      console.log(row, col);
      setToMove({
        ...toMove,
        rowTwo: row,
        colTwo: col,
      });
    }
  }
  const queryClient = useQueryClient();
  useMutation;
  return (
    <div style={{ display: "flex" }} className="App">
      {data?.map((row, rowIndex) => {
        return (
          <div style={{ flexDirection: "row" }}>
            {row.map((cell, cellIndex) => {
              return (
                <div
                  onClick={() => selectPiece(rowIndex, cellIndex)}
                  style={{
                    flexDirection: "column",
                    height: 50,
                    width: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3em",
                    backgroundColor: `${
                      rowIndex === toMove.rowOne && cellIndex === toMove.colOne
                        ? "#FFCCCB"
                        : (rowIndex + cellIndex) % 2 != 0
                        ? "grey"
                        : "white"
                    }`,
                    color: "black",
                  }}
                >
                  <span>
                    {(() => {
                      switch (cell) {
                        case 0:
                          return "";
                        case 1:
                          return "♙";
                        case 2:
                          return "♖";
                        case 3:
                          return "♘";
                        case 4:
                          return "♗";
                        case 5:
                          return "♕";
                        case 6:
                          return "♔";
                        case 7:
                          return "♟";
                        case 8:
                          return "♜";
                        case 9:
                          return "♞";
                        case 10:
                          return "♝";
                        case 11:
                          return "♛";
                        case 12:
                          return "♚";
                        default:
                          return "";
                      }
                    })()}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
