'use server';
import NavBar from '@src/components/nav/NavBar';
import { ParamsType } from '@src/types/params.type';
import { FunctionComponent } from 'react';

const Home: FunctionComponent<ParamsType> = async ({ params }) => {
  return (
    <>
      <NavBar params={params} />
      <div>Home</div>
    </>
  );
};

export default Home;
