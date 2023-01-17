import { NDZViolationTable } from "components/NDZViolationTable";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { NDZviolation } from "../types";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [ndzViolations, setNdzViolations] = useState<Array<NDZviolation>>([]);

  trpc.violation.getAll.useQuery(undefined, {
    onSuccess(violations) {
      setNdzViolations(violations);
    },
    onError(err) {
      console.log(err);
    },
  });

  trpc.violation.onUpdate.useSubscription(undefined, {
    onData(updatedViolations) {
      setNdzViolations(updatedViolations);
    },
    onError(err) {
      console.log(err);
    },
  });

  if (!ndzViolations) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>No Drone Zone Violations</title>
        <meta name="description" content="No Drone Zone Violations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-600 px-4 pb-4">
        <div className="flex justify-center py-6">
          <h1 className="text-4xl font-bold text-gray-100">
            No Drone Zone Violations
          </h1>
        </div>
        <NDZViolationTable violations={ndzViolations} />
      </main>
    </>
  );
};

export default Home;
