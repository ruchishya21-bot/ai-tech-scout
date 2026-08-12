import { Request, Response } from "express";
import { pool } from "../config/database";
import { researchTechnology } from "../services/geminiService";

// CREATE RESEARCH
export const createResearch = async (
  req: Request,
  res: Response
) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Research topic is required",
      });
    }

    // Create research session
    const sessionResult = await pool.query(
      `
      INSERT INTO research_sessions (topic, status)
      VALUES ($1, $2)
      RETURNING *
      `,
      [topic.trim(), "pending"]
    );

    const research = sessionResult.rows[0];

    try {
      // Generate AI research
      const result = await researchTechnology(topic.trim());

      // Save AI result
      const resultQuery = await pool.query(
        `
        INSERT INTO research_results
        (
          research_session_id,
          summary,
          comparison,
          advantages,
          disadvantages,
          recommendation
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
          research.id,
          result.summary,
          result.comparison,
          result.advantages,
          result.disadvantages,
          result.recommendation,
        ]
      );

      // Mark session completed
      const updatedSession = await pool.query(
        `
        UPDATE research_sessions
        SET status = $1
        WHERE id = $2
        RETURNING *
        `,
        ["completed", research.id]
      );

      return res.status(201).json({
        success: true,
        message: "Research completed successfully",
        research: updatedSession.rows[0],
        result: resultQuery.rows[0],
      });
    } catch (aiError) {
      console.error("Create research error:", aiError);

      // Mark research as failed
      await pool.query(
        `
        UPDATE research_sessions
        SET status = $1
        WHERE id = $2
        `,
        ["failed", research.id]
      );

      return res.status(503).json({
        success: false,
        message: "AI research failed. Please try again.",
      });
    }
  } catch (error) {
    console.error("Create research error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create research",
    });
  }
};


// GET ALL RESEARCH
export const getAllResearch = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `
      SELECT
        rs.*,
        rr.id AS result_id,
        rr.summary,
        rr.comparison,
        rr.advantages,
        rr.disadvantages,
        rr.recommendation
      FROM research_sessions rs
      LEFT JOIN research_results rr
        ON rs.id = rr.research_session_id
      ORDER BY rs.created_at DESC
      `
    );

    return res.json({
      success: true,
      research: result.rows,
    });
  } catch (error) {
    console.error("Get research error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch research history",
    });
  }
};


// GET RESEARCH BY ID
export const getResearchById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        rs.*,
        rr.id AS result_id,
        rr.summary,
        rr.comparison,
        rr.advantages,
        rr.disadvantages,
        rr.recommendation
      FROM research_sessions rs
      LEFT JOIN research_results rr
        ON rs.id = rr.research_session_id
      WHERE rs.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    return res.json({
      success: true,
      research: result.rows[0],
    });
  } catch (error) {
    console.error("Get research by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch research",
    });
  }
};


// DELETE RESEARCH
export const deleteResearch = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Check whether research exists
    const research = await pool.query(
      `
      SELECT id
      FROM research_sessions
      WHERE id = $1
      `,
      [id]
    );

    if (research.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Research session not found",
      });
    }

    // Delete associated AI result first
    await pool.query(
      `
      DELETE FROM research_results
      WHERE research_session_id = $1
      `,
      [id]
    );

    // Delete research session
    await pool.query(
      `
      DELETE FROM research_sessions
      WHERE id = $1
      `,
      [id]
    );

    return res.json({
      success: true,
      message: "Research deleted successfully",
    });
  } catch (error) {
    console.error("Delete research error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete research",
    });
  }
};