import type { RootState } from "../../store/store";
import { apiSlice } from "../apiSlice";

type GeneralPageParam = {
  skip: number;
  limit: number;
  sort_by?: "mu" | "upvotes" | "downvotes" | "sigma" | "comparisons";
  sort_order?: "asc" | "desc";
};

type CompetitionEntry = {
  id: string;
  competition_id: string;
  post_id: string;
  owner_id: string;
  mu: number;
  sigma: number;
  upvotes: number;
  downvotes: number;
  comparisons: number;
};

type CompetitionEntryResponse = {
  data: CompetitionEntry[];
  count: number;
};

type CompetitionsResponse = {
  data: CompetitionEntry[];
  count: number;
};

type CreateCompetitionPayload = {
  category: string;
  description: string;
  start_time: string;
  vote_start_time: string;
  end_time: string;
};

type CompetitionStatus = "pending" | "capturing" | "voting" | "finished";

type CompetitionResponse = {
  id: string;
  category: string;
  description: string;
  created_at: string;
  status: CompetitionStatus;
  start_time: string;
  vote_start_time: string;
  end_time: string;
  competition_number: number;
};

type CompetitionUpdate = {
  category?: string;
  description?: string;
  status?: CompetitionStatus;
  start_time?: string;
  vote_start_time?: string;
  end_time?: string;
};

type CompetitionUpdatePayload = {
  competition_id: string;
  body: CompetitionUpdate;
};

export const competitionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompetitions: builder.infiniteQuery<
      CompetitionsResponse,
      void,
      GeneralPageParam
    >({
      query: ({ pageParam: { skip, limit, sort_by, sort_order } }) => {
        const params = new URLSearchParams();
        if (skip) params.append("offset", skip.toString());
        if (limit) params.append("limit", limit.toString());
        if (sort_by) params.append("sort_by", sort_by.toString());
        if (sort_order) params.append("sort_order", sort_order.toString());

        return `admin/competitions/?${params.toString()}`;
      },
      infiniteQueryOptions: {
        initialPageParam: {
          limit: 20,
          skip: 0,
          sort_by: "mu",
          sort_order: "desc",
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          if (lastPage.count < lastPageParam.limit) {
            return undefined;
          }
          const lastPost = lastPage.data.at(-1);

          if (!lastPost) {
            console.warn(
              "No last data found on the last page, stopping pagination."
            );
            return undefined;
          }

          return {
            limit: lastPageParam.limit,
            skip: lastPageParam.skip + lastPage.count,
            sort_by: lastPageParam.sort_by,
            sort_order: lastPageParam.sort_order,
          };
        },
      },
      providesTags: ["Competitions"],
    }),

    getCompetitionEntries: builder.infiniteQuery<
      CompetitionEntryResponse,
      string,
      GeneralPageParam
    >({
      query: ({
        pageParam: { skip, limit, sort_by, sort_order },
        queryArg: competition_id,
      }) => {
        const params = new URLSearchParams();
        if (skip) params.append("offset", skip.toString());
        if (limit) params.append("limit", limit.toString());
        if (sort_by) params.append("sort_by", sort_by.toString());
        if (sort_order) params.append("sort_order", sort_order.toString());

        return `admin/competitions/${competition_id}/entries?${params.toString()}`;
      },
      infiniteQueryOptions: {
        initialPageParam: {
          limit: 20,
          skip: 0,
          sort_by: "mu",
          sort_order: "desc",
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          if (lastPage.count < lastPageParam.limit) {
            return undefined;
          }
          const lastPost = lastPage.data.at(-1);

          if (!lastPost) {
            console.warn(
              "No last data found on the last page, stopping pagination."
            );
            return undefined;
          }

          return {
            limit: lastPageParam.limit,
            skip: lastPageParam.skip + lastPage.count,
            sort_by: lastPageParam.sort_by,
            sort_order: lastPageParam.sort_order,
          };
        },
      },
    }),

    getCurrentCompetition: builder.query<CompetitionsResponse, void>({
      query: () => "admin/competitions/current",
    }),

    createCompetition: builder.mutation<
      CompetitionResponse,
      CreateCompetitionPayload
    >({
      query: (newCompetition) => ({
        url: "admin/competitions",
        method: "POST",
        body: newCompetition,
      }),
      invalidatesTags: ["Competitions"],
    }),

    updateCompetition: builder.mutation<
      CompetitionResponse,
      CompetitionUpdatePayload
    >({
      query: ({ competition_id, body }) => ({
        url: `admin/competitions/${competition_id}`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["Competitions"],
    }),
  }),
});

export const {
  useGetCompetitionsInfiniteQuery,
  useGetCompetitionEntriesInfiniteQuery,
  useGetCurrentCompetitionQuery,
  useCreateCompetitionMutation,
  useUpdateCompetitionMutation,
} = competitionsApi;
