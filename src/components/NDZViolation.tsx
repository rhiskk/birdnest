import { NDZviolation } from "../types";

export const NDZViolation = ({ violation }: { violation: NDZviolation }) => {
  const { pilot, drone } = violation;
  return (
    <tr className="border-b border-gray-700">
      <th className="bg-gray-800 px-6 py-4 font-medium text-gray-200">
        <div className="flex justify-center">
          {pilot.firstName} {pilot.lastName}
        </div>
      </th>
      <td className="truncate bg-gray-900 px-2 py-4">
        <div className="flex justify-center">{pilot.email}</div>
      </td>
      <td className="truncate bg-gray-800 px-2 py-4">
        <div className="flex justify-center">{pilot.phoneNumber}</div>
      </td>
      <td className="bg-gray-900 px-6 py-4">
        <div className="flex justify-center">
          {drone.closestDistance.toFixed(2)}m
        </div>
      </td>
    </tr>
  );
};
