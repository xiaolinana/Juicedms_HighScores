
import {BlockType} from "@/src/types/block";

type State = {
    tiles: {
        [id: string]: BlockType;
    };
    inMotion: boolean;
    hasChanged: boolean;
    byIds: string[];
};

export const initialState: State = {
    tiles: {},
    byIds: [],
    hasChanged: false,
    inMotion: false,
};

type Action =
    | { type: "CREATE_TILE"; tile: BlockType }
    | { type: "UPDATE_TILE"; tile: BlockType }
    | { type: "MERGE_TILE"; source: BlockType; destination: BlockType }
    | { type: "START_MOVE" }
    | { type: "END_MOVE" };

export const GameReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "CREATE_TILE":
            return {
                ...state,
                tiles: {
                    ...state.tiles,
                    [action.tile.id]: action.tile,
                },
                byIds: [...state.byIds, action.tile.id],
                hasChanged: false,
            };
        case "UPDATE_TILE":
            return {
                ...state,
                tiles: {
                    ...state.tiles,
                    [action.tile.id]: action.tile,
                },
                hasChanged: true,
            };
        case "MERGE_TILE":
            const {
                [action.source.id]: source,
                [action.destination.id]: destination,
                ...restTiles
            } = state.tiles;
            return {
                ...state,
                tiles: {
                    ...restTiles,
                    [action.destination.id]: {
                        id: action.destination.id,
                        value: action.source.value + action.destination.value,
                        position: action.destination.position,
                    },
                },
                byIds: state.byIds.filter((id) => id !== action.source.id),
                hasChanged: true,
            };
        case "START_MOVE":
            return {