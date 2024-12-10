'use server';
import NavBar from '@src/components/nav/NavBar';
import { Params } from '@src/types/params.type';
import { FunctionComponent } from 'react';

const Home: FunctionComponent<Params> = async ({ params }) => {
  return (
    <>
      <NavBar params={params} />
      <div>Home</div>
    </>
  );
};

export default Home;
