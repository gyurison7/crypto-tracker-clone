import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexCharts from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { themeState } from "../atom";

interface ChartProps {
  coinId?: string;
}

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

export function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId || "")
  );
  const themeMode = useRecoilValue(themeState);

  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
        <ApexCharts
          type="candlestick"
          series={[
            {
              data:
                data?.map((price) => ({
                  x: new Date(price.time_open * 1000),
                  y: [
                    parseFloat(price.open),
                    parseFloat(price.high),
                    parseFloat(price.low),
                    parseFloat(price.close),
                  ],
                })) || [],
            },
          ]}
          options={{
            chart: {
              background: "transparent",
              toolbar: {
                show: false,
              },
            },
            theme: {
              mode: themeMode === "light" ? "light" : "dark",
            },
            xaxis: {
              type: "datetime",
            },
          }}
        />
      )}
    </div>
  );
}
