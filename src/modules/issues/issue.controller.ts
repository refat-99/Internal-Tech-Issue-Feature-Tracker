import type { Request, Response } from "express";
import * as IssueService from "./issue.service";

export const createIssueController = async (
  req: any,
  res: Response
) => {
  try {
    const result = await IssueService.createIssue(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
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

    res.status(200).json({
      success: true,
      message: "Issues retrived successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
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
      await IssueService.getSingleIssue(
        Number(req.params.id)
      );

    res.status(200).json({
      success: true,
      message: "Issue retrived successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
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

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
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

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};