'use server';
import NavBar from '@src/components/nav/NavBar';
import { FunctionComponent } from 'react';
import { Props } from './layout';

const Home: FunctionComponent<Props> = async ({ params }) => {
  const { locale } = await params;
  return (
    <>
      <NavBar params={{ locale }} />
      <div>Home</div>
    </>
  );
};

export default Home;
