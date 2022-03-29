import {Schema, ArraySchema, type} from '@colyseus/schema';

export interface IPokemonRecord {
  name: string;
  items: string[];
}
export class PokemonRecord extends Schema implements IPokemonRecord{
  @type('string') name:string;
  @type(['string']) items = new ArraySchema<string>();

  constructor(mongoPokemon: any) {
    super();
    this.name = mongoPokemon.name;
    mongoPokemon.items.forEach((it: string)=>{
      this.items.push(it);
    });
  }
}

export interface IGameRecord {
  time: number;
  rank: number;
  pokemons: IPokemonRecord[],
  elo:number
}

export class GameRecord extends Schema implements IGameRecord{
  @type('uint64') time: number;
  @type('uint8') rank: number;
  @type([PokemonRecord]) pokemons = new ArraySchema<IPokemonRecord>();
  @type('uint16') elo: number;

  constructor(time: number, rank: number, elo:number, pokemons:any[]) {
    super();
    this.time = time;
    this.rank = rank;
    this.elo = elo;

    pokemons.forEach((pokemon) =>{
      this.pokemons.push(new PokemonRecord(pokemon));
    });
  }
}
