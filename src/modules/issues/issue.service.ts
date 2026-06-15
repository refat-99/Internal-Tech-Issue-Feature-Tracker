import { pool } from "../../db/db";
import type { IIssue, IUser } from "../../types/type";

export const createIssue = async (
  payload: IIssue,
  reporterId: number
) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues
    (title,description,type,reporter_id)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [title, description, type, reporterId]
  );

  return result.rows[0];
};

export const getAllIssues = async (
  query: any
) => {
  const { sort = "newest", type, status } =
    query;

  let sql = "SELECT * FROM issues";
  const values: any[] = [];
  const conditions: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(
      `type = $${values.length}`
    );
  }

  if (status) {
    values.push(status);
    conditions.push(
      `status = $${values.length}`
    );
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(
      " AND "
    )}`;
  }

  sql +=
    sort === "oldest"
      ? " ORDER BY created_at ASC"
      : " ORDER BY created_at DESC";

  const issuesResult = await pool.query(
    sql,
    values
  );

  const issues = issuesResult.rows;

  const reporterIds = [
    ...new Set(
      issues.map(
        (issue) => issue.reporter_id
      )
    ),
  ];

  if (reporterIds.length === 0) {
    return [];
  }

  const usersResult = await pool.query(
    `
    SELECT id,name,role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds]
  );

  const users = usersResult.rows;

  return issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: users.find(
      (u) => u.id === issue.reporter_id
    ),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));
};

export const getSingleIssue = async (
  id: number
) => {
  const issueResult = await pool.query(
    "SELECT * FROM issues WHERE id=$1",
    [id]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  const userResult = await pool.query(
    `
    SELECT id,name,role
    FROM users
    WHERE id=$1
    `,
    [issue.reporter_id]
  );

  return {
    ...issue,
    reporter: userResult.rows[0],
  };
};

export const updateIssue = async (
  id: number,
  payload: any,
  currentUser: IUser
) => {
  const issueResult = await pool.query(
    "SELECT * FROM issues WHERE id=$1",
    [id]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (
    currentUser.role === "contributor"
  ) {
    if (
      issue.reporter_id !== currentUser.id
    ) {
      throw new Error(
        "You can update only your own issue"
      );
    }

    if (issue.status !== "open") {
      throw new Error(
        "Cannot update non-open issue"
      );
    }
  }

  const {title, description, type, status } = payload;

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title=$1,
      description=$2,
      type=$3,
      status=$4,
      updated_at=NOW()
    WHERE id=$5
    RETURNING *
    `,
    [
      title,
      description,
      type,
      status || issue.status,
      id,
    ]
  );

  return result.rows[0];
};

export const deleteIssue = async (id: number) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );

  if (!result.rows[0]) {
    throw new Error("Issue not found");
  }

  return result.rows[0];
};