import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export const EndpointTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
}): JSX.Element | null => {
  if (active && payload) {
    const {
      requests,
      response_time,
      name,
      method,
      status_codes,
      count_green,
      count_yellow,
      count_red,
    } = payload[0].payload;

    const green = ((count_green / requests) * 100).toFixed();
    const yellow = ((count_yellow / requests) * 100).toFixed();
    const red = ((count_red / requests) * 100).toFixed();

    return (
      <div className="bg-base-100 card shadow rounded-lg p-4">
        <ul className="list-none">
          <li>
            Path: <span className="font-bold text-white">{name}</span>
          </li>
          <li>
            Method:{' '}
            <span className={`font-bold text-method-${method.toLowerCase()}`}>{method}</span>
          </li>
          <li>
            Requests: <span className="font-bold">{requests}</span>
          </li>
          <li>
            Avg. response time: <span className="font-bold">{response_time}</span>
          </li>
          <li>
            Status codes: <span className="font-bold">{status_codes.join(', ')}</span>
          </li>
          <p>Requests counts by response time percentiles:</p>
          <li>
            <span className="text-success">Top 33rd:</span> {green} %
          </li>
          <li>
            <span className="text-warning">Mid 33rd:</span> {yellow} %
          </li>
          <li>
            <span className="text-error">Bottom 33rd:</span> {red} %
          </li>
        </ul>
      </div>
    );
  }

  return null;
};
