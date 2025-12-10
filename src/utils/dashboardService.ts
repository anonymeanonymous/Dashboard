import { supabase } from './supabase';
import { ChartConfig, Dashboard, Dataset } from '../types/dashboard';

export const dashboardService = {
  async getDashboards() {
    const { data, error } = await supabase
      .from('dashboards')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getDashboard(id: string) {
    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (dashboardError) throw dashboardError;
    if (!dashboard) return null;

    const { data: charts, error: chartsError } = await supabase
      .from('charts')
      .select('*')
      .eq('dashboard_id', id)
      .order('created_at', { ascending: true });

    if (chartsError) throw chartsError;

    return { ...dashboard, charts: charts || [] };
  },

  async createDashboard(name: string, description?: string) {
    const { data, error } = await supabase
      .from('dashboards')
      .insert([{ name, description }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDashboard(id: string, name: string, description?: string) {
    const { data, error } = await supabase
      .from('dashboards')
      .update({ name, description, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDashboard(id: string) {
    const { error } = await supabase
      .from('dashboards')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async addChart(dashboardId: string, config: ChartConfig) {
    const { data, error } = await supabase
      .from('charts')
      .insert([{
        dashboard_id: dashboardId,
        title: config.title,
        type: config.type,
        x_axis: config.xAxis,
        y_axis: config.yAxis,
        aggregation: config.aggregation,
        colors: config.colors,
        position: config.position || {},
        filters: config.filters || []
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateChart(chartId: string, config: Partial<ChartConfig>) {
    const { data, error } = await supabase
      .from('charts')
      .update({
        ...(config.title && { title: config.title }),
        ...(config.type && { type: config.type }),
        ...(config.xAxis !== undefined && { x_axis: config.xAxis }),
        ...(config.yAxis && { y_axis: config.yAxis }),
        ...(config.aggregation && { aggregation: config.aggregation }),
        ...(config.colors && { colors: config.colors }),
        ...(config.position && { position: config.position }),
        ...(config.filters && { filters: config.filters }),
        updated_at: new Date().toISOString()
      })
      .eq('id', chartId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteChart(chartId: string) {
    const { error } = await supabase
      .from('charts')
      .delete()
      .eq('id', chartId);

    if (error) throw error;
  },

  async getDatasets() {
    const { data, error } = await supabase
      .from('datasets')
      .select('id, name, columns, created_at, updated_at')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getDataset(id: string) {
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async saveDataset(name: string, data: unknown[], columns: unknown[]) {
    const { data: result, error } = await supabase
      .from('datasets')
      .insert([{ name, data, columns }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async deleteDataset(id: string) {
    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
