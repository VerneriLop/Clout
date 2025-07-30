import {useMemo, useState} from 'react';

import {DataGrid} from '@mui/x-data-grid';
import type {GridColDef, GridRowId} from '@mui/x-data-grid';
import {useNavigate} from 'react-router';
import {
  type CompetitionResponse,
  useGetCompetitionsInfiniteQuery,
  useUpdateCompetitionMutation,
} from '~/redux/api/endpoints/competitions';

const columns: GridColDef[] = [
  {field: 'id', headerName: 'ID'}, //, width: 250 },
  {field: 'category', headerName: 'Category', editable: true}, //, width: 130 },
  {field: 'description', headerName: 'Description', editable: true}, //, width: 200 },
  {field: 'status', headerName: 'Status', editable: true}, //, width: 120 },
  {
    field: 'created_at',
    headerName: 'Created At',
    //width: 180,
    valueFormatter: params => new Date(params).toLocaleString(),
  },
  {
    field: 'start_time',
    headerName: 'Start Time',
    //width: 180,
    valueFormatter: params => new Date(params).toLocaleString(),
    editable: true,
  },
  {
    field: 'vote_start_time',
    headerName: 'Vote Start Time',
    //width: 180,
    valueFormatter: params => new Date(params).toLocaleString(),
    editable: true,
  },
  {
    field: 'end_time',
    headerName: 'End Time',
    //width: 180,
    valueFormatter: params => new Date(params).toLocaleString(),
    editable: true,
  },
  {
    field: 'competition_number',
    headerName: 'Competition #',
    //width: 150,
    type: 'number',
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<GridRowId>();
  const [updateCompetition] = useUpdateCompetitionMutation();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetCompetitionsInfiniteQuery();

  const competitions = useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

  const handleEntriesClick = () => {
    navigate(`/competitions/${selectedId}/entries`);
  };

  const handleVotesClick = () => {
    navigate(`/competitions/${selectedId}/votes`);
  };

  const handleUpdate = (
    newRow: CompetitionResponse,
    oldRow: CompetitionResponse,
  ) => {
    const changedFields: Partial<CompetitionResponse> = {};

    //checking which cell is updated.
    Object.keys(newRow).forEach(key => {
      const typedKey = key as keyof CompetitionResponse;
      const newValue = newRow[typedKey];
      const oldValue = oldRow[typedKey];

      if (newValue !== oldValue) {
        (changedFields as any)[typedKey] = newValue;
      }
    });

    updateCompetition({competition_id: oldRow.id, body: changedFields});
    console.log('Muutetut kentät:', changedFields);

    return newRow;
  };

  return (
    <main className="flex-1 flex flex-col bg-neutral-900 p-4 overflow-hidden">
      {/* Large table on top */}
      <div className="flex gap-4 pb-2 justify-between">
        <h2 className=" font-semibold bg-stone-900">Competitions</h2>
        {selectedId && (
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
            onClick={() => handleEntriesClick()}>
            Show selected entries
          </button>
        )}
        {selectedId && (
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
            onClick={() => handleVotesClick()}>
            Show selected votes
          </button>
        )}
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
          onClick={refetch}
          disabled={isLoading}>
          Refresh
        </button>
      </div>
      <div className="flex-1 mb-1 overflow-auto rounded border border-stone-700">
        <DataGrid
          rows={competitions}
          columns={columns}
          checkboxSelection={false}
          onRowSelectionModelChange={newSelection => {
            const id = Array.from(newSelection.ids)[0];
            setSelectedId(id);
          }}
          pageSizeOptions={[5, 10]}
          disableColumnMenu
          disableColumnSorting
          sx={{
            border: 0,
          }}
          processRowUpdate={handleUpdate}
        />
      </div>
    </main>
  );
}

/*
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex flex-col h-screen w-45 bg-stone-950 text-white p-4 border-r border-r-neutral-700">
          <h2 className="text-2xl font-semibold mb-4 text-left">Clout Admin</h2>

          <nav className="flex flex-col justify-between flex-1 ">
            
            <div>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block rounded p-2 hover:bg-stone-700 ${isActive ? "bg-stone-800" : ""}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  `block rounded p-2 hover:bg-stone-700 ${isActive ? "bg-stone-800" : ""}`
                }
              >
                Posts
              </NavLink>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `block rounded p-2 hover:bg-stone-700 ${isActive ? "bg-stone-800" : ""}`
                }
              >
                Users
              </NavLink>
              <NavLink
                to="/competition"
                className={({ isActive }) =>
                  `block rounded p-2 hover:bg-stone-700 ${isActive ? "bg-stone-800" : ""}`
                }
              >
                Competitions
              </NavLink>
            </div>

      
            <div className="flex flex-col space-y-2">
              <a href="/profile" className="hover:bg-stone-700 rounded">
                Profile
              </a>
              <a href="/settings" className="hover:bg-stone-700 rounded ">
                Settings
              </a>
              <button
                onClick={() => console.log("Logging out...")}
                className="text-left text-red-600 hover:text-red-800 rounded"
              >
                Logout
              </button>
            </div>
          </nav>
        </aside>
        */
