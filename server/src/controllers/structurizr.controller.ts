// src/controllers/structurizr.controller.ts
import { Request, Response } from 'express';
import Workspace from '../models/Workspace.model';

export const getStructurizrOverviewStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalWorkspaces = await Workspace.countDocuments();
        const activeWorkspaces = await Workspace.countDocuments({ archived: 'false' });
        
        // Using eonID as a proxy for "users" associated with workspaces
        const distinctEonIDs = await Workspace.distinct('eonID');
        const uniqueUserProxyCount = distinctEonIDs.filter(id => id != null).length; // Count non-null distinct eonIDs

        // Using instance as a proxy for "departments" or "systems"
        const distinctInstances = await Workspace.distinct('instance');
        const uniqueInstanceProxyCount = distinctInstances.filter(id => id != null).length;

        res.json({
            activeWorkspaces: activeWorkspaces,
            totalWorkspaces: totalWorkspaces,
            // The UI shows "Total Users" and "Total Departments" as separate cards.
            // We'll provide proxies for these based on the available data.
            // Frontend will need to understand these are derived proxies.
            totalUsersProxy: uniqueUserProxyCount, 
            totalDepartmentsProxy: uniqueInstanceProxyCount,
            // Trend data cannot be derived from snapshot data without historical context.
            // The frontend will have to manage the display of "trend" arrows statically or as N/A.
        });
    } catch (error: any) {
        console.error('Error fetching Structurizr overview stats:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getStructurizrWorkspacesByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const activeCount = await Workspace.countDocuments({ archived: 'false' });
        const archivedCount = await Workspace.countDocuments({ archived: 'true' });
        const totalCount = await Workspace.countDocuments(); // Total "created" proxy

        // This data is for the "Structurizr Workspaces" chart.
        // It provides snapshot counts, not time-series data for a line chart.
        // The frontend chart will need to represent these as current totals.
        res.json({
            active: activeCount,
            archived: archivedCount, // Corresponds to "Deleted" in Figma if "archived" means deleted
            totalCreatedProxy: totalCount, // Corresponds to "Created" in Figma
        });
    } catch (error: any) {
        console.error('Error fetching Structurizr workspaces by status:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// STUB: For "How workspaces are being accessed" - Data not available
export const getStructurizrAccessMethods = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
        message: "Data for workspace access methods (API, CLI, etc.) is not available from the current 'workspace' collection.",
        data: [] // Return empty array as placeholder for table/chart data
    });
};

// STUB: For "Top Users" chart for Structurizr - Data not available
export const getStructurizrTopUsers = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
        message: "Data for Structurizr top users (names, detailed activity) is not available beyond eonID counts.",
        data: [] // Return empty array as placeholder
    });
};