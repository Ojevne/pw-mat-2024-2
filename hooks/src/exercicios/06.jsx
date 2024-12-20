import * as React from 'react'
// 🐨 você vai precisar dos seguintes itens de '../pokemon':
// fetchPokemon: a função que retorna as informações do pokémon
// PokemonInfoFallback: o que é exibido enquanto as informações do pokémon
// são carregadas
// PokemonDataView: o componente usado para exibir as informações do pokémon

import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 crie o estado para o pokémon (null)
  // const [pokemon, setPokemon] = React.useState(null)
  // const [error, setError] = React.useState(false)
  // const [status, setStatus] = React.useState('ocioso')

  //Convertendo 3 variáveis de estado avulsas para uma única
  //variável e estado em forma de objeto

  const [state, setState] = React.useState({
    pokemon: null,
    error: false,
    status:'ocioso'

  })
  //Para facilitar o código, podemos criar variáveis somente-leitura
  // a partir da variável de estado de objeto usando desestruturação
  const {pokemon, error, status} = state

  // 🐨 crie React.useEffect de modo a ser chamado sempre que pokemonName mudar.
  // 💰 NÃO SE ESQUEÇA DO VETOR DE DEPENDÊNCIAS!

   // 🐨 crie uma ref aqui usando React.useRef()
   const tiltRef = React.useRef()

  React.useEffect(()=> {

    // 💰 se pokemonName é falso (ou uma string vazia) não se preocupe em fazer 
  // a requisição (retorne precocemente).
  if (!pokemonName) return

  // 🐨 antes de chamar `fetchPokemon`, limpe o estado atual do pokemon
  // ajustando-o para null.

// //para atualizar apenas o campo 'pokemon';
// const stateCopy = {...state}
// stateCopy.pokemon = 'novo valor'
// setState(stateCopy)
// //Para facilitar, é possível fazer todas as operações
// //numa única linha.A linha abaixo è a mesma coisa da de cima.
// setState({...state, pokemon:'novo valor'})

  // setPokemon(null)
  // setError(false)
  // setStatus('ocioso')

  //Atualizando os três status simultâneamente, gerando apenas um redesenho do componente.
  setState({pokemon: null, error: false, status:'ocioso'})

  React.useEffect(()=>{
    console.count("Atualizou estado")
  })//retirou o vetor de dependencias "[]" será executdo após qualquer atualização de estado.

  // (Isso é para habilitar o estado de carregamento ao alternar entre diferentes
  // pokémon.)
  // 💰 Use a função `fetchPokemon` para buscar um pokémon pelo seu nome:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* atualize todos os estados aqui */},
  //   )

  //setStatus('pendente')
  setState({...state, status: 'pendente'})

  //fetchPokemon() enviará pokemonName para o servidor remoto e aguardará
  //o retorno de pokemonData. Quando pokemon Data for retornado, atualiza
  //a variável de estado pokemon com as informações contidas em pokemonData
  fetchPokemon(pokemonName)
  // then() é chamado quando a requisição dá certo.
  .then(
    pokemonData => {
    // setPokemon (pokemonData)
    // setStatus('resolvida')
    setState({...state, pokemon:pokemonData, status: 'resolvida'})
    }
  )

  //catch() é chamado quando a requisição dá erro.
  .catch(
    //Guardamos o erro em um estado para depois exibir a 
    //respectiva mensagem
    error => {
      // setError(error)
      // setStatus('rejeitada')
      //aqui ele tem o mesmo nome, então não precisa repetir.
      //setState({...state, error:error, status: 'rejeitada'})
      setState({...state, error, status: 'rejeitada'})
    }
    )

  }, [pokemonName])


  // 🐨 retorne o seguinte baseado nos estados `pokemon` e `pokemonName`:
  //   1. não há pokemonName: 'Informe um pokémon'
  //   2. tem pokemonName mas não pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. tem pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remova isso


//   if(error) return <div role="alert">
//     Houve um erro: <pre style={{ whiteSpace: 'normal' }}>
//       {error.message}
//       </pre>
//     </div>

// if (!pokemonName) return 'Informe um pokemon' //1.
// else if (pokemonName && !pokemon) 
//   return <PokemonInfoFallback name={pokemonName} />//2
// else if (pokemon) return <PokemonInfoFallback name={pokemonName} />
// }

switch (status)
 {
  case 'ocioso':
    return 'Informe um pokémon'
  case 'pendente':
    return <PokemonInfoFallback name={pokemonName} />
    case 'resolvida':
      return <PokemonDataView pokemon={pokemon} />

  default: //caso rejeitada
    return <div role='alert'>
        Houve um erro:<pre style={{whiteSpace: 'normal'}}>
        {error.message}
        </pre>
    </div>
 }
}

 function Exercicio06() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

// Aqui estava faltando o fechamento da função Exercicio06 e do export
export default Exercicio06