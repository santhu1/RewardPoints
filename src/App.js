import React, { useState, useEffect, useMemo } from "react";
import fetch from "./api/mockData";
import styled from "styled-components";
import "./App.css";
import _ from "lodash";
import calculateResults from "./calculateResults";
import Table from "./Table";
import constant from "./constant";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function App() {
  const [transactionData, setTransactionData] = useState(null);
  const columns = useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? "👇" : "👉"}
          </span>
        )
      },
      {
        Header: "Customer",
        accessor: "name"
      },
      {
        Header: "Month",
        accessor: "month"
      },
      {
        Header: "# of Transactions",
        accessor: "numTransactions"
      },
      {
        Header: "Reward Points",
        accessor: "points"
      }
    ],
    []
  );

  const totalsByColumns = [
    {
      Header: "Customer",
      accessor: "name"
    },
    {
      Header: "Points",
      accessor: "points"
    }
  ];

  useEffect(() => {
    fetch().then(data => {
      const results = calculateResults(data);
      setTransactionData(results);
    });
  }, []);

  function getIndividualTransactions({ row }) {
    console.log(constant);
    let byCustMonth = _.filter(transactionData.pointsPerTransaction, tRow => {
      return (
        row.original.custid === tRow.custid &&
        row.original.monthNumber === tRow.month
      );
    });
    return byCustMonth;
  }

  if (transactionData == null) {
    return <div>Loading...</div>;
  }

  return transactionData == null ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-10">
            <h2>Points Rewards System Totals by Customer Months</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <Styles>
              <Table
                columns={columns}
                data={transactionData.summaryByCustomer}
                renderRowSubComponent={row => {
                  return (
                    <div>
                      {getIndividualTransactions(row).map(tran => {
                        return (
                          <div className="container">
                            <div className="row">
                              <div className="col-8">
                                <strong>Transaction Date:</strong>{" "}
                                {tran.transactionDt} - <strong>$</strong>
                                {tran.amt} - <strong>Points: </strong>
                                {tran.points}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
            </Styles>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-10">
            <h2>Points Rewards System Totals By Customer</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <Styles>
              <Table
                columns={totalsByColumns}
                data={transactionData.totalPointsByCustomer}
              />
            </Styles>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
