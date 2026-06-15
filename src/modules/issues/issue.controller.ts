import type { Request, Response } from "express";
import * as IssueService from "./issue.service";
import sendResponse from "../../utility/sendResponse";

export const createIssueController = async (
  req: any,
  res: Response
) => {
  try {
    const result = await IssueService.createIssue(req.body,req.user.id
    );

sendResponse(res, {
  statusCode: 200,
  success: true,
  message: "Issue created successfully",
  data: result,
});
  } catch (error: any) {
     sendResponse(res, {
    statusCode: 400,
    success: false,
    message: error.message,
  });
  }
};

export const getAllIssuesController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await IssueService.getAllIssues(
      req.query
    );

  sendResponse(res, {
  statusCode: 200,
  success: true,
  message: "Issue retrived successfully",
  data: result,
});

    // res.status(200).json({
    //   success: true,
    //   message: "Issues retrived successfully",
    //   data: result,
    // });
  } catch (error: any) {
    sendResponse(res, {
    statusCode: 500,
    success: false,
    message: error.message,
  });
  }
};

export const getSingleIssueController = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await IssueService.getSingleIssue(Number(req.params.id));
      sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Issue retrived successfully",
        data: result,
      })
  } catch (error: any) {
    sendResponse(res, {
    statusCode: 404,
    success: false,
    message: error.message,
  });
}
};

export const updateIssueController = async (
  req: any,
  res: Response
) => {
  try {
    const result = await IssueService.updateIssue(
      Number(req.params.id),
      req.body,
      req.user
    );
    sendResponse(res, {
  statusCode: 200,
  success: true,
  message: "Issue updated successfully",
  data: result,
});
  } catch (error: any) {
    sendResponse(res, {
    statusCode: error.message === "Issue not found" ? 404 : 403,
    success: false,
    message: error.message,
  });
  }
};

export const deleteIssueController = async (
  req: Request,
  res: Response
) => {
  try {
    await IssueService.deleteIssue(
      Number(req.params.id)
    );

  sendResponse(res, {
  statusCode: 200,
  success: true,
  message: "Issue deleted successfully",
})
  }catch (error: any) {
  sendResponse(res, {
    statusCode: 404,
    success: false,
    message: error.message,
  });
}
};