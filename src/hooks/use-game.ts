
import {useCallback, useEffect, useId, useReducer, useRef} from "react";
import {GameReducer, initialState} from "@/src/reducer/game";
import {BlockType} from "@/src/types/block";

export const useGame = () => {
    const isInitialRender = useRef(true);
    const nextId = useId();
    // state
    const [state, dispatch] = useReducer(GameReducer, initialState);
    const { tiles, byIds, hasChanged, inMotion } = state;

    const createTile = useCallback(
        ({ position, value }: Partial<BlockType>) => {
            const tile = {
                id: nextId,
                position,
                value,
            } as BlockType;
            dispatch({ type: "CREATE_TILE", tile });
        },
        [nextId]
    );

    const mergeTile = (source: BlockType, destination: BlockType) => {
        dispatch({ type: "MERGE_TILE", source, destination });
    };

    // A must-have to keep the sliding animation if the action merges tiles together.
    const throttledMergeTile = (source: BlockType, destination: BlockType) => {
        setTimeout(() => mergeTile(source, destination), 100);
    };

    const updateTile = (tile: BlockType) => {
        dispatch({ type: "UPDATE_TILE", tile });
    };

    const didTileMove = (source: BlockType, destination: BlockType) => {
        const hasXChanged = source.position[0] !== destination.position[0];
        const hasYChanged = source.position[1] !== destination.position[1];

        return hasXChanged || hasYChanged;
    };

    const retrieveTileMap = useCallback(() => {
        const tileMap = new Array(
            4 * 4
        ).fill('0');

        byIds.forEach((id) => {
            const { position } = tiles[id];
            const index = positionToIndex(position);
            tileMap[index] = id;
        });

        return tileMap;
    }, [byIds, tiles]);

    const findEmptyTiles = useCallback(() => {
        const tileMap = retrieveTileMap();

        const emptyTiles = tileMap.reduce((result, tileId, index) => {
            if (tileId === 0) {
                return [...result, indexToPosition(index) as [number, number]];
            }

            return result;
        }, [] as [number, number][]);

        return emptyTiles;
    }, [retrieveTileMap]);

    const generateRandomTile = useCallback(() => {
        const emptyTiles = findEmptyTiles();

        if (emptyTiles.length > 0) {
            const index = Math.floor(Math.random() * emptyTiles.length);
            const position = emptyTiles[index];

            createTile({ position, value: 2 });
        }
    }, [findEmptyTiles, createTile]);

    const positionToIndex = (position: [number, number]) => {
        return position[1] * 4 + position[0];
    };

    const indexToPosition = (index: number) => {
        const x = index % 4;
        const y = Math.floor(index / 4);
        return [x, y];
    };

    type RetrieveTileIdsPerRowOrColumn = (rowOrColumnIndex: number) => number[];

    type CalculateTileIndex = (
        tileIndex: number,
        tileInRowIndex: number,
        howManyMerges: number,
        maxIndexInRow: number
    ) => number;

    const move = (
        retrieveTileIdsPerRowOrColumn: RetrieveTileIdsPerRowOrColumn,
        calculateFirstFreeIndex: CalculateTileIndex
    ) => {
        // new tiles cannot be created during motion.
        dispatch({ type: "START_MOVE" });

        const maxIndex = 4 - 1;

        // iterates through every row or column (depends on move kind - vertical or horizontal).
        for (
            let rowOrColumnIndex = 0;
            rowOrColumnIndex < 4;
            rowOrColumnIndex += 1
        ) {
            // retrieves tiles in the row or column.
            const availableTileIds = retrieveTileIdsPerRowOrColumn(rowOrColumnIndex);