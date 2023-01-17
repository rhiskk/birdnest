import { NDZviolation } from "../types";
import { NDZViolation } from "./NDZViolation";

export const NDZViolationTable = ({
  violations,
}: {
  violations: NDZviolation[];
}) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="text-xs uppercase text-gray-400">
          <tr>
            <th scope="col" className="0 bg-gray-800 px-6 py-3">
              <div className="flex justify-center">Pilot name</div>
            </th>
            <th scope="col" className="bg-gray-900 px-6 py-3">
              <div className="flex justify-center">Email address</div>
            </th>
            <th scope="col" className="bg-gray-800 px-6 py-3">
              <div className="flex justify-center">Phone number</div>
            </th>
            <th scope="col" className="bg-gray-900 px-6 py-3">
              <div className="flex justify-center">Closest distance</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {violations.map((violation) => (
            <NDZViolation violation={violation} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
