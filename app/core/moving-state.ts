import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { PokemonActionState } from "../types/enum/Game"
import { Synergy } from "../types/enum/Synergy"

export default class MovingState extends PokemonState {
  update(
    pokemon: PokemonEntity,
    dt: number,
    board: Board,
    climate: string
  ) {
    super.update(pokemon, dt, board, climate)
    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = 500
      const targetCoordinate = this.getNearestTargetCoordinate(pokemon, board)
      // no target case
      // eslint-disable-next-line no-empty
      if (!targetCoordinate) {
      } else if (
        board.distance(
          pokemon.positionX,
          pokemon.positionY,
          targetCoordinate.x,
          targetCoordinate.y
        ) <= pokemon.range
      ) {
        pokemon.toAttackingState()
      } else {
        this.move(pokemon, board, targetCoordinate)
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt)
    }
  }

  move(
    pokemon: PokemonEntity,
    board: Board,
    coordinates: { x: number; y: number }
  ) {
    //logger.debug('move attempt');

    let x: number | undefined = undefined
    let y: number | undefined = undefined
    if (pokemon.types.includes(Synergy.DARK) && pokemon.baseRange === 1) {
      const farthestCoordinate = this.getFarthestTargetCoordinateAvailablePlace(
        pokemon,
        board
      )
      //logger.debug({ farthestCoordinate })
      if (farthestCoordinate) {
        x = farthestCoordinate.x
        y = farthestCoordinate.y
      }
    } else {
      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
      let distance = 999

      cells.forEach((cell) => {
        if (cell.value === undefined) {
          const candidateDistance = board.distance(
            coordinates.x,
            coordinates.y,
            cell.row,
            cell.column
          )
          // logger.debug(`Candidate (${cell.row},${cell.column}) to ${coordinates}, distance: ${candidateDistance}`);
          if (candidateDistance < distance) {
            distance = candidateDistance
            x = cell.row
            y = cell.column
          }
        }
      })
    }
    if (x !== undefined && y !== undefined) {
      pokemon.orientation = board.orientation(
        pokemon.positionX,
        pokemon.positionY,
        x,
        y,
        pokemon,
        undefined
      )
      // logger.debug(`pokemon moved from (${pokemon.positionX},${pokemon.positionY}) to (${x},${y}), (desired direction (${coordinates[0]}, ${coordinates[1]})), orientation: ${pokemon.orientation}`);
      board.swapValue(pokemon.positionX, pokemon.positionY, x, y)
      pokemon.positionX = x
      pokemon.positionY = y
    }
  }

  onEnter(pokemon: PokemonEntity) {
    super.onEnter(pokemon)
    pokemon.action = PokemonActionState.WALK
  }

  onExit(pokemon: PokemonEntity) {
    super.onExit(pokemon)
  }
}