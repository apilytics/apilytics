import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export const RouteTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}): JSX.Element | null => {
  if (active && payload) {
    const { requests, response_time, count_green, count_yellow, count_red } = payload[0].payload;

    const green = ((count_green / requests) * 100).toFixed();
    const yellow = ((count_yellow / requests) * 100).toFixed();
    const red = ((count_red / requests) * 100).toFixed();

    return (
      <div className="bg-base-100 card shadow-2xl rounded-lg p-4">
        <ul>
          <li>
            Path: <span className="text-primary">{label}</span>
          </li>
          <li>
            Requests: <span className="font-bold">{requests}</span>
          </li>
          <li>
            Avg. response time: <span className="font-bold">{response_time}</span>
          </li>
          <p>Requests counts by response time percentiles:</p>
          <li>
            <span className="text-requests-green">Top 33th:</span> {green} %
          </li>
          <li>
            <span className="text-requests-yellow">Mid 33th:</span> {yellow} %
          </li>
          <li>
            <span className="text-requests-red">Bottom 33th:</span> {red} %
          </li>
        </ul>
      </div>
    );
  }

  return null;
};
