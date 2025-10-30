// mocks/handlers.js
import { http, HttpResponse } from "msw";

const USER = {
  appearanceSettings: {
    theme: "dark",
    accentColor: "red",
    fontFamily: "monospace",
    animationsEnabled: true,
    iconPack: "rounded",
  },
  _id: "689e3bc05658dbce4b80258e",
  username: "the_aditi",
  firstname: "Aditi",
  lastname: "Singh",
  email: "test1@email.com",
  totalBalance: 0,
  avatar: "avatar1",
  level: 1,
  hasProvidedStartingBalance: false,
  createdAt: "2025-08-14T19:40:48.144Z",
  updatedAt: "2025-10-05T09:04:15.057Z",
};

const FeatureNotAvailableFn = () =>
  HttpResponse.json({
    success: true,
    message: "Feature not available in demo",
  });

export const handlers = [
  // Auth
  http.post("http://localhost:4000/api/auth/login", async () => {
    return HttpResponse.json({
      success: true,
      message: "User logged in successfully",
      user: USER,
    });
  }),
  http.post("http://localhost:4000/api/auth/register", () => {
    return HttpResponse.json({
      user: {
        /*...*/
      },
      token: "demo-token",
    });
  }),
  http.post("http://localhost:4000/api/auth/logout", () => {
    return HttpResponse.json({
      success: true,
      message: "Logout successful",
    });
  }),
  http.get("http://localhost:4000/api/auth/me", (...everything) => {
  // const token = cookies["jwt"]; // replace with actual cookie name
  // console.log("Token from cookie:", token);
  console.log({everything});
  return HttpResponse.json({
    user: USER,
  });

  }),

  // Transactions
  http.get("http://localhost:4000/api/transaction", () => {
    return HttpResponse.json({
      success: true,
      message: "Transactions fetched successfully",
      page: 1,
      limit: 25,
      total: 3,
      totalPages: 1,
      transactions: [
        {
          _id: "68c2fadf5f147bacd702eb8f",
          transactionType: "outflow",
          amount: 1000,
          transactionDate: "2025-09-11T16:26:57.062Z",
          category: "wants",
          note: "ice cream",
          userId: "689e3bc05658dbce4b80258e",
          createdAt: "2025-09-11T16:37:51.092Z",
          updatedAt: "2025-09-11T16:37:51.092Z",
          __v: 0,
        },
        {
          _id: "689e47385658dbce4b8025b7",
          transactionType: "inflow",
          amount: 1220,
          transactionDate: "2025-08-13T20:11:36.838Z",
          category: "savings",
          note: "test",
          userId: "689e3bc05658dbce4b80258e",
          createdAt: "2025-08-14T20:29:44.487Z",
          updatedAt: "2025-08-14T20:31:44.995Z",
          __v: 0,
        },
        {
          _id: "689e49e25658dbce4b8025d3",
          transactionType: "outflow",
          amount: 1220,
          transactionDate: "2025-08-13T20:11:36.838Z",
          category: "savings",
          note: "test",
          userId: "689e3bc05658dbce4b80258e",
          createdAt: "2025-08-14T20:41:06.207Z",
          updatedAt: "2025-08-14T20:42:07.946Z",
          __v: 0,
        },
      ],
    });
  }),
  http.post("http://localhost:4000/api/transaction", () => {
    return HttpResponse.json({
      transaction: {
        /*...*/
      },
    });
  }),
  http.put("http://localhost:4000/api/transaction/:transactionId", () => {
    return HttpResponse.json({
      transaction: {
        /*...*/
      },
    });
  }),
  http.delete("http://localhost:4000/api/transaction/:transactionId", () => {
    return HttpResponse.json({ success: true });
  }),

  // Users
  http.get("http://localhost:4000/api/users/search", FeatureNotAvailableFn),
  http.put("http://localhost:4000/api/users/settings", FeatureNotAvailableFn),
  http.get("http://localhost:4000/api/users/notifications", () => {
    return HttpResponse.json({ success: true, invitations: [] });
  }),
  http.post("http://localhost:4000/api/users/invite", FeatureNotAvailableFn),
  http.get("http://localhost:4000/api/users/dashboard", () => {
    return HttpResponse.json({
      success: true,
      message: "Dashboard details fetched successfully",
      totalPercentage: {
        savings: 70.93,
        wants: 29.07,
        investments: 0,
        needs: 0,
      },
      monthDetails: [
        {
          savings: 0,
          wants: 0,
          investments: 0,
          needs: 0,
          month: "january",
        },
        {
          savings: 0,
          wants: 0,
          investments: 0,
          needs: 0,
          month: "february",
        },
        {
          savings: 0,
          wants: 0,
          investments: 0,
          needs: 0,
          month: "march",
        },
        {
          savings: 0,
          wants: 0,
          investments: 0,
          needs: 0,
          month: "april",
        },
        {
          savings: 0,
          wants: 0,
          investments: 0,
          needs: 0,
          month: "may",
        },
        {
          savings: 0,
          wants: 0,
          investments: 0,
          needs: 0,
          month: "june",
        },
        {
          savings: 0,
          wants: 0,
          investments: 0,
          needs: 0,
          month: "july",
        },
        {
          savings: 2440,
          wants: 0,
          investments: 0,
          needs: 0,
          month: "august",
        },
        {
          savings: 0,
          wants: 1000,
          investments: 0,
          needs: 0,
          month: "september",
        },
        {
          savings: 0,
          wants: 0,
          investments: 0,
          needs: 0,
          month: "october",
        },
      ],
      totalByCategory: {
        savings: 2440,
        wants: 1000,
        investments: 0,
        needs: 0,
      },
    });
  }),

  // Groups
  http.post("http://localhost:4000/api/group", FeatureNotAvailableFn),
  http.get("http://localhost:4000/api/group", () => {
    return HttpResponse.json({
      success: true,
      groups: [],
    });
  }),
  http.delete(
    "http://localhost:4000/api/group/:groupId",
    FeatureNotAvailableFn
  ),
  http.get("http://localhost:4000/api/group/:groupId", FeatureNotAvailableFn),
  http.put(
    "http://localhost:4000/api/group/:groupId/add",
    FeatureNotAvailableFn
  ),
  http.put(
    "http://localhost:4000/api/group/:groupId/remove",
    FeatureNotAvailableFn
  ),
  http.put("http://localhost:4000/api/group/:groupId", FeatureNotAvailableFn),

  // Group Transactions
  http.post(
    "http://localhost:4000/api/group/:groupId/transaction",
    FeatureNotAvailableFn
  ),
  http.get(
    "http://localhost:4000/api/group/:groupId/transaction",
    FeatureNotAvailableFn
  ),
  http.put(
    "http://localhost:4000/api/group/:groupId/transaction/:transactionId",
    FeatureNotAvailableFn
  ),
  http.delete(
    "http://localhost:4000/api/group/:groupId/transaction/:transactionId",
    FeatureNotAvailableFn
  ),

  // Group Balance Board
  http.get(
    "http://localhost:4000/api/group/:groupId/balance",
    FeatureNotAvailableFn
  ),
];
