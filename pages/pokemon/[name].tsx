
import {wrapper} from '../../store';
import type { PageMetaProps } from '../_app';
import {getPokemonName, getRunningOperationPromises} from '../../api/pokemonApi';
import { useRouter } from 'next/router';

import {useGetPokemonNameQuery} from '../../api/pokemonApi'


export default function PockemonPage () {

    const router = useRouter();

    const name =  router.query.name as string;
    const { isLoading, error, data } = useGetPokemonNameQuery(name);

    return (
      <article>
        {error && <>Oh no, there was an error</>}
        {isLoading && <>Loading...</>}
        {!isLoading && !error && data && (
          <>
            <h3>{data.species.name}</h3>
            <div>
              <img src={data.sprites.front_shiny} alt={data.species.name} />
              <img src={data.sprites.back_default} alt={data.species.name} />
              <img src={data.sprites.front_default} alt={data.species.name} />
            </div>
            <div>{data.height}</div>
            <div>
              <h1>Movments</h1>
              {data.moves.map((move) => (
                <div key={move.move.url}>
                  <a href={move.move.url}>{move.move.name}</a>
                </div>
              ))}
            </div>
            <div>
              <h1>Game</h1>
              {data.game_indices.map((game) => (
                <div key={game.version.url}>
                  <a href={game.version.url}>{game.version.name}</a>
                </div>
              ))}
            </div>
          </>
        )}
      </article>
    );

}

PockemonPage.renderLayoutOnServer = false;

export const getServerSideProps = wrapper.getServerSideProps<PageMetaProps>(
  (store) => async (context) => {
    const name = context.params?.name as string;
    const renderOnServer = context.query.renderOnServer === 'false' ? false : true;

    const {data} = await store.dispatch(getPokemonName.initiate(name));
    
    await Promise.all(getRunningOperationPromises());
   


    return {
      props: {
        title: data?.species.name || '',
        image: data?.sprites.front_shiny || '',
        description: 'Pockemon',
        type: '',
        url: '',
        renderOnServer: renderOnServer,
      },
    };
  }
);