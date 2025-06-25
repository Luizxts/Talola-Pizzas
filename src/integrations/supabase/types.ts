export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_fees: {
        Row: {
          collected_at: string | null
          fee_amount: number
          id: string
          withdrawal_id: string | null
        }
        Insert: {
          collected_at?: string | null
          fee_amount: number
          id?: string
          withdrawal_id?: string | null
        }
        Update: {
          collected_at?: string | null
          fee_amount?: number
          id?: string
          withdrawal_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_fees_withdrawal_id_fkey"
            columns: ["withdrawal_id"]
            isOneToOne: false
            referencedRelation: "withdrawals"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          total_fees_collected: number | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          total_fees_collected?: number | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          total_fees_collected?: number | null
          username?: string
        }
        Relationships: []
      }
      ai_decisions: {
        Row: {
          actual_outcome: Json | null
          completed_at: string | null
          confidence_level: number
          created_at: string
          decision_type: string
          executed_at: string | null
          expected_outcome: Json
          id: string
          market_analysis: Json
          reasoning: string
          risk_assessment: Json
          strategy_used: string
          symbol: string
          timeframe: string
          user_id: string
        }
        Insert: {
          actual_outcome?: Json | null
          completed_at?: string | null
          confidence_level: number
          created_at?: string
          decision_type: string
          executed_at?: string | null
          expected_outcome: Json
          id?: string
          market_analysis: Json
          reasoning: string
          risk_assessment: Json
          strategy_used: string
          symbol: string
          timeframe: string
          user_id: string
        }
        Update: {
          actual_outcome?: Json | null
          completed_at?: string | null
          confidence_level?: number
          created_at?: string
          decision_type?: string
          executed_at?: string | null
          expected_outcome?: Json
          id?: string
          market_analysis?: Json
          reasoning?: string
          risk_assessment?: Json
          strategy_used?: string
          symbol?: string
          timeframe?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_evolution: {
        Row: {
          ai_level: number
          created_at: string
          evolution_stage: string
          experience_points: number
          id: string
          successful_trades: number
          total_profit: number
          total_trades: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_level?: number
          created_at?: string
          evolution_stage?: string
          experience_points?: number
          id?: string
          successful_trades?: number
          total_profit?: number
          total_trades?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_level?: number
          created_at?: string
          evolution_stage?: string
          experience_points?: number
          id?: string
          successful_trades?: number
          total_profit?: number
          total_trades?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_learning_history: {
        Row: {
          ai_confidence_level: number
          created_at: string
          failed_trades: number
          id: string
          learning_date: string
          learning_summary: string
          loss_incurred: number
          market_insights: string | null
          patterns_discovered: string[] | null
          profit_gained: number
          risk_assessments: Json | null
          strategies_learned: string[] | null
          successful_trades: number
          trades_analyzed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_confidence_level?: number
          created_at?: string
          failed_trades?: number
          id?: string
          learning_date?: string
          learning_summary: string
          loss_incurred?: number
          market_insights?: string | null
          patterns_discovered?: string[] | null
          profit_gained?: number
          risk_assessments?: Json | null
          strategies_learned?: string[] | null
          successful_trades?: number
          trades_analyzed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_confidence_level?: number
          created_at?: string
          failed_trades?: number
          id?: string
          learning_date?: string
          learning_summary?: string
          loss_incurred?: number
          market_insights?: string | null
          patterns_discovered?: string[] | null
          profit_gained?: number
          risk_assessments?: Json | null
          strategies_learned?: string[] | null
          successful_trades?: number
          trades_analyzed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_learning_patterns: {
        Row: {
          adaptation_level: number
          avg_profit_per_trade: number
          confidence_score: number
          created_at: string
          entry_conditions: Json
          exit_conditions: Json
          failure_count: number
          id: string
          last_used_at: string | null
          market_conditions: Json
          max_drawdown: number
          pattern_name: string
          sharpe_ratio: number | null
          success_count: number
          times_used: number
          total_profit: number
          updated_at: string
          user_id: string
          win_rate: number
        }
        Insert: {
          adaptation_level?: number
          avg_profit_per_trade?: number
          confidence_score?: number
          created_at?: string
          entry_conditions: Json
          exit_conditions: Json
          failure_count?: number
          id?: string
          last_used_at?: string | null
          market_conditions: Json
          max_drawdown?: number
          pattern_name: string
          sharpe_ratio?: number | null
          success_count?: number
          times_used?: number
          total_profit?: number
          updated_at?: string
          user_id: string
          win_rate?: number
        }
        Update: {
          adaptation_level?: number
          avg_profit_per_trade?: number
          confidence_score?: number
          created_at?: string
          entry_conditions?: Json
          exit_conditions?: Json
          failure_count?: number
          id?: string
          last_used_at?: string | null
          market_conditions?: Json
          max_drawdown?: number
          pattern_name?: string
          sharpe_ratio?: number | null
          success_count?: number
          times_used?: number
          total_profit?: number
          updated_at?: string
          user_id?: string
          win_rate?: number
        }
        Relationships: []
      }
      ai_performance: {
        Row: {
          balance_current: number
          balance_start: number
          best_trade: number
          confidence_level: number
          current_strategy: string
          id: string
          last_update: string
          losing_trades: number
          market_condition: string
          profit_today: number
          session_date: string
          total_trades_today: number
          trading_session_id: string
          user_id: string
          winning_trades: number
          worst_trade: number
        }
        Insert: {
          balance_current: number
          balance_start: number
          best_trade?: number
          confidence_level?: number
          current_strategy: string
          id?: string
          last_update?: string
          losing_trades?: number
          market_condition: string
          profit_today?: number
          session_date?: string
          total_trades_today?: number
          trading_session_id?: string
          user_id: string
          winning_trades?: number
          worst_trade?: number
        }
        Update: {
          balance_current?: number
          balance_start?: number
          best_trade?: number
          confidence_level?: number
          current_strategy?: string
          id?: string
          last_update?: string
          losing_trades?: number
          market_condition?: string
          profit_today?: number
          session_date?: string
          total_trades_today?: number
          trading_session_id?: string
          user_id?: string
          winning_trades?: number
          worst_trade?: number
        }
        Relationships: []
      }
      ai_strategies: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          market_conditions: string[]
          risk_level: string
          strategy_data: Json
          strategy_name: string
          success_rate: number
          timeframe: string
          total_profit: number
          total_trades: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          market_conditions?: string[]
          risk_level?: string
          strategy_data: Json
          strategy_name: string
          success_rate?: number
          timeframe?: string
          total_profit?: number
          total_trades?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          market_conditions?: string[]
          risk_level?: string
          strategy_data?: Json
          strategy_name?: string
          success_rate?: number
          timeframe?: string
          total_profit?: number
          total_trades?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_trading_signals: {
        Row: {
          actual_entry_price: number | null
          actual_exit_price: number | null
          actual_profit: number | null
          confidence_level: number
          correlation_analysis: Json
          created_at: string
          entry_price: number
          execution_time: string | null
          expected_return: number
          expires_at: string
          fundamental_data: Json
          id: string
          is_active: boolean
          is_executed: boolean
          liquidity_score: number
          market_analysis: Json
          market_conditions: string
          news_impact_score: number
          position_size: number
          probability_success: number
          risk_percentage: number
          risk_score: number
          sentiment_analysis: Json
          signal_quality_score: number
          signal_type: string
          social_sentiment: number
          stop_loss_price: number
          strategy_name: string
          symbol: string
          target_prices: Json
          technical_indicators: Json
          timeframe: string
          updated_at: string
          user_id: string
          volatility_forecast: number
          whale_activity: number
        }
        Insert: {
          actual_entry_price?: number | null
          actual_exit_price?: number | null
          actual_profit?: number | null
          confidence_level: number
          correlation_analysis?: Json
          created_at?: string
          entry_price: number
          execution_time?: string | null
          expected_return?: number
          expires_at: string
          fundamental_data?: Json
          id?: string
          is_active?: boolean
          is_executed?: boolean
          liquidity_score?: number
          market_analysis?: Json
          market_conditions: string
          news_impact_score?: number
          position_size: number
          probability_success?: number
          risk_percentage: number
          risk_score?: number
          sentiment_analysis?: Json
          signal_quality_score?: number
          signal_type: string
          social_sentiment?: number
          stop_loss_price: number
          strategy_name: string
          symbol: string
          target_prices?: Json
          technical_indicators?: Json
          timeframe: string
          updated_at?: string
          user_id: string
          volatility_forecast?: number
          whale_activity?: number
        }
        Update: {
          actual_entry_price?: number | null
          actual_exit_price?: number | null
          actual_profit?: number | null
          confidence_level?: number
          correlation_analysis?: Json
          created_at?: string
          entry_price?: number
          execution_time?: string | null
          expected_return?: number
          expires_at?: string
          fundamental_data?: Json
          id?: string
          is_active?: boolean
          is_executed?: boolean
          liquidity_score?: number
          market_analysis?: Json
          market_conditions?: string
          news_impact_score?: number
          position_size?: number
          probability_success?: number
          risk_percentage?: number
          risk_score?: number
          sentiment_analysis?: Json
          signal_quality_score?: number
          signal_type?: string
          social_sentiment?: number
          stop_loss_price?: number
          strategy_name?: string
          symbol?: string
          target_prices?: Json
          technical_indicators?: Json
          timeframe?: string
          updated_at?: string
          user_id?: string
          volatility_forecast?: number
          whale_activity?: number
        }
        Relationships: []
      }
      backtesting_results: {
        Row: {
          avg_loss: number
          avg_win: number
          created_at: string
          end_date: string
          expectancy: number
          final_capital: number
          id: string
          initial_capital: number
          losing_trades: number
          max_drawdown: number
          profit_factor: number
          sharpe_ratio: number
          sortino_ratio: number
          start_date: string
          strategy_name: string
          strategy_parameters: Json
          symbol: string
          timeframe: string
          total_return: number
          total_trades: number
          trade_details: Json
          user_id: string
          win_rate: number
          winning_trades: number
        }
        Insert: {
          avg_loss: number
          avg_win: number
          created_at?: string
          end_date: string
          expectancy: number
          final_capital: number
          id?: string
          initial_capital: number
          losing_trades: number
          max_drawdown: number
          profit_factor: number
          sharpe_ratio: number
          sortino_ratio: number
          start_date: string
          strategy_name: string
          strategy_parameters: Json
          symbol: string
          timeframe: string
          total_return: number
          total_trades: number
          trade_details: Json
          user_id: string
          win_rate: number
          winning_trades: number
        }
        Update: {
          avg_loss?: number
          avg_win?: number
          created_at?: string
          end_date?: string
          expectancy?: number
          final_capital?: number
          id?: string
          initial_capital?: number
          losing_trades?: number
          max_drawdown?: number
          profit_factor?: number
          sharpe_ratio?: number
          sortino_ratio?: number
          start_date?: string
          strategy_name?: string
          strategy_parameters?: Json
          symbol?: string
          timeframe?: string
          total_return?: number
          total_trades?: number
          trade_details?: Json
          user_id?: string
          win_rate?: number
          winning_trades?: number
        }
        Relationships: []
      }
      binance_market_data: {
        Row: {
          ask_price: number | null
          ask_qty: number | null
          bid_price: number | null
          bid_qty: number | null
          close_time: string | null
          created_at: string
          first_trade_id: number | null
          high_24h: number
          id: string
          last_trade_id: number | null
          low_24h: number
          open_price_24h: number
          open_time: string | null
          prev_close_price: number
          price: number
          price_change_24h: number
          price_change_percent_24h: number
          quote_volume_24h: number
          symbol: string
          timestamp: string
          trade_count: number | null
          updated_at: string
          volume_24h: number
          weighted_avg_price: number | null
        }
        Insert: {
          ask_price?: number | null
          ask_qty?: number | null
          bid_price?: number | null
          bid_qty?: number | null
          close_time?: string | null
          created_at?: string
          first_trade_id?: number | null
          high_24h?: number
          id?: string
          last_trade_id?: number | null
          low_24h?: number
          open_price_24h?: number
          open_time?: string | null
          prev_close_price?: number
          price: number
          price_change_24h?: number
          price_change_percent_24h?: number
          quote_volume_24h?: number
          symbol: string
          timestamp?: string
          trade_count?: number | null
          updated_at?: string
          volume_24h?: number
          weighted_avg_price?: number | null
        }
        Update: {
          ask_price?: number | null
          ask_qty?: number | null
          bid_price?: number | null
          bid_qty?: number | null
          close_time?: string | null
          created_at?: string
          first_trade_id?: number | null
          high_24h?: number
          id?: string
          last_trade_id?: number | null
          low_24h?: number
          open_price_24h?: number
          open_time?: string | null
          prev_close_price?: number
          price?: number
          price_change_24h?: number
          price_change_percent_24h?: number
          quote_volume_24h?: number
          symbol?: string
          timestamp?: string
          trade_count?: number | null
          updated_at?: string
          volume_24h?: number
          weighted_avg_price?: number | null
        }
        Relationships: []
      }
      binance_orderbook: {
        Row: {
          asks: Json
          bids: Json
          created_at: string
          id: string
          last_update_id: number | null
          symbol: string
          timestamp: string
        }
        Insert: {
          asks?: Json
          bids?: Json
          created_at?: string
          id?: string
          last_update_id?: number | null
          symbol: string
          timestamp?: string
        }
        Update: {
          asks?: Json
          bids?: Json
          created_at?: string
          id?: string
          last_update_id?: number | null
          symbol?: string
          timestamp?: string
        }
        Relationships: []
      }
      binance_trade_executions: {
        Row: {
          ai_confidence: number | null
          binance_client_order_id: string | null
          binance_order_id: string
          commission: number
          commission_asset: string | null
          created_at: string
          cumulative_quote_qty: number
          entry_reason: string | null
          executed_qty: number
          exit_reason: string | null
          fees_paid: number | null
          fills: Json
          id: string
          is_maker: boolean | null
          market_conditions: Json | null
          price: number
          profit_loss: number | null
          quantity: number
          side: string
          status: string
          strategy_used: string | null
          symbol: string
          time_in_force: string | null
          transaction_time: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_confidence?: number | null
          binance_client_order_id?: string | null
          binance_order_id: string
          commission?: number
          commission_asset?: string | null
          created_at?: string
          cumulative_quote_qty: number
          entry_reason?: string | null
          executed_qty: number
          exit_reason?: string | null
          fees_paid?: number | null
          fills?: Json
          id?: string
          is_maker?: boolean | null
          market_conditions?: Json | null
          price: number
          profit_loss?: number | null
          quantity: number
          side: string
          status: string
          strategy_used?: string | null
          symbol: string
          time_in_force?: string | null
          transaction_time: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_confidence?: number | null
          binance_client_order_id?: string | null
          binance_order_id?: string
          commission?: number
          commission_asset?: string | null
          created_at?: string
          cumulative_quote_qty?: number
          entry_reason?: string | null
          executed_qty?: number
          exit_reason?: string | null
          fees_paid?: number | null
          fills?: Json
          id?: string
          is_maker?: boolean | null
          market_conditions?: Json | null
          price?: number
          profit_loss?: number | null
          quantity?: number
          side?: string
          status?: string
          strategy_used?: string | null
          symbol?: string
          time_in_force?: string | null
          transaction_time?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      copy_trading_sessions: {
        Row: {
          allocation_percentage: number
          copy_all_trades: boolean
          copy_symbols: string[] | null
          created_at: string
          exclude_symbols: string[] | null
          follower_id: string
          id: string
          is_active: boolean
          leader_id: string
          max_allocation_amount: number | null
          performance_stats: Json | null
          risk_multiplier: number
          updated_at: string
        }
        Insert: {
          allocation_percentage?: number
          copy_all_trades?: boolean
          copy_symbols?: string[] | null
          created_at?: string
          exclude_symbols?: string[] | null
          follower_id: string
          id?: string
          is_active?: boolean
          leader_id: string
          max_allocation_amount?: number | null
          performance_stats?: Json | null
          risk_multiplier?: number
          updated_at?: string
        }
        Update: {
          allocation_percentage?: number
          copy_all_trades?: boolean
          copy_symbols?: string[] | null
          created_at?: string
          exclude_symbols?: string[] | null
          follower_id?: string
          id?: string
          is_active?: boolean
          leader_id?: string
          max_allocation_amount?: number | null
          performance_stats?: Json | null
          risk_multiplier?: number
          updated_at?: string
        }
        Relationships: []
      }
      custom_strategies: {
        Row: {
          backtest_results: Json | null
          created_at: string
          description: string | null
          entry_conditions: Json
          exit_conditions: Json
          id: string
          is_active: boolean
          is_public: boolean
          performance_metrics: Json | null
          risk_management: Json
          strategy_name: string
          symbols: string[]
          timeframes: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          backtest_results?: Json | null
          created_at?: string
          description?: string | null
          entry_conditions?: Json
          exit_conditions?: Json
          id?: string
          is_active?: boolean
          is_public?: boolean
          performance_metrics?: Json | null
          risk_management?: Json
          strategy_name: string
          symbols?: string[]
          timeframes?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          backtest_results?: Json | null
          created_at?: string
          description?: string | null
          entry_conditions?: Json
          exit_conditions?: Json
          id?: string
          is_active?: boolean
          is_public?: boolean
          performance_metrics?: Json | null
          risk_management?: Json
          strategy_name?: string
          symbols?: string[]
          timeframes?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      delivery_addresses: {
        Row: {
          city: string
          complement: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          is_default: boolean | null
          neighborhood: string
          number: string
          reference: string | null
          street: string
          zip_code: string | null
        }
        Insert: {
          city?: string
          complement?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_default?: boolean | null
          neighborhood: string
          number: string
          reference?: string | null
          street: string
          zip_code?: string | null
        }
        Update: {
          city?: string
          complement?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_default?: boolean | null
          neighborhood?: string
          number?: string
          reference?: string | null
          street?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_trader_signals: {
        Row: {
          confidence: number
          created_at: string
          entry_price: number
          expires_at: string
          id: string
          market_analysis: string
          risk_reward_ratio: number
          signal_type: string
          stop_loss: number | null
          success_rate: number
          symbol: string
          take_profit: number | null
          timeframe: string
          trader_name: string
        }
        Insert: {
          confidence: number
          created_at?: string
          entry_price: number
          expires_at?: string
          id?: string
          market_analysis: string
          risk_reward_ratio: number
          signal_type: string
          stop_loss?: number | null
          success_rate?: number
          symbol: string
          take_profit?: number | null
          timeframe: string
          trader_name: string
        }
        Update: {
          confidence?: number
          created_at?: string
          entry_price?: number
          expires_at?: string
          id?: string
          market_analysis?: string
          risk_reward_ratio?: number
          signal_type?: string
          stop_loss?: number | null
          success_rate?: number
          symbol?: string
          take_profit?: number | null
          timeframe?: string
          trader_name?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          bet_amount: number
          created_at: string | null
          finished_at: string | null
          game_state: Json | null
          game_type: string
          id: string
          mode: string
          player1_id: string | null
          player2_id: string | null
          status: string | null
          winner_id: string | null
        }
        Insert: {
          bet_amount: number
          created_at?: string | null
          finished_at?: string | null
          game_state?: Json | null
          game_type: string
          id?: string
          mode: string
          player1_id?: string | null
          player2_id?: string | null
          status?: string | null
          winner_id?: string | null
        }
        Update: {
          bet_amount?: number
          created_at?: string | null
          finished_at?: string | null
          game_state?: Json | null
          game_type?: string
          id?: string
          mode?: string
          player1_id?: string | null
          player2_id?: string | null
          status?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      market_data: {
        Row: {
          ath: number | null
          ath_date: string | null
          atl: number | null
          atl_date: string | null
          circulating_supply: number | null
          created_at: string
          high_24h: number | null
          id: string
          last_updated: string
          low_24h: number | null
          market_cap: number | null
          price: number
          price_change_24h: number
          price_change_percent_24h: number
          symbol: string
          total_supply: number | null
          volume_24h: number
        }
        Insert: {
          ath?: number | null
          ath_date?: string | null
          atl?: number | null
          atl_date?: string | null
          circulating_supply?: number | null
          created_at?: string
          high_24h?: number | null
          id?: string
          last_updated?: string
          low_24h?: number | null
          market_cap?: number | null
          price: number
          price_change_24h?: number
          price_change_percent_24h?: number
          symbol: string
          total_supply?: number | null
          volume_24h?: number
        }
        Update: {
          ath?: number | null
          ath_date?: string | null
          atl?: number | null
          atl_date?: string | null
          circulating_supply?: number | null
          created_at?: string
          high_24h?: number | null
          id?: string
          last_updated?: string
          low_24h?: number | null
          market_cap?: number | null
          price?: number
          price_change_24h?: number
          price_change_percent_24h?: number
          symbol?: string
          total_supply?: number | null
          volume_24h?: number
        }
        Relationships: []
      }
      market_patterns: {
        Row: {
          completed_at: string | null
          created_at: string
          entry_point: number
          id: string
          identified_at: string
          pattern_confidence: number
          pattern_data: Json
          pattern_type: string
          risk_reward_ratio: number
          status: string
          stop_loss: number
          success_rate: number | null
          symbol: string
          target_price: number
          timeframe: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          entry_point: number
          id?: string
          identified_at?: string
          pattern_confidence: number
          pattern_data: Json
          pattern_type: string
          risk_reward_ratio: number
          status?: string
          stop_loss: number
          success_rate?: number | null
          symbol: string
          target_price: number
          timeframe: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          entry_point?: number
          id?: string
          identified_at?: string
          pattern_confidence?: number
          pattern_data?: Json
          pattern_type?: string
          risk_reward_ratio?: number
          status?: string
          stop_loss?: number
          success_rate?: number | null
          symbol?: string
          target_price?: number
          timeframe?: string
          user_id?: string
        }
        Relationships: []
      }
      market_sentiment_analysis: {
        Row: {
          analyzed_at: string
          created_at: string
          fear_greed_index: number
          id: string
          market_cap_flow: number
          news_sentiment: number
          prediction_accuracy: number | null
          sentiment_score: number
          social_volume: number
          symbol: string
          user_id: string
          whale_activity: number
        }
        Insert: {
          analyzed_at?: string
          created_at?: string
          fear_greed_index: number
          id?: string
          market_cap_flow?: number
          news_sentiment?: number
          prediction_accuracy?: number | null
          sentiment_score: number
          social_volume?: number
          symbol: string
          user_id: string
          whale_activity?: number
        }
        Update: {
          analyzed_at?: string
          created_at?: string
          fear_greed_index?: number
          id?: string
          market_cap_flow?: number
          news_sentiment?: number
          prediction_accuracy?: number | null
          sentiment_score?: number
          social_volume?: number
          symbol?: string
          user_id?: string
          whale_activity?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_important: boolean
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_important?: boolean
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_important?: boolean
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          customizations: Json | null
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          customizations?: Json | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          customizations?: Json | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          confirmed_at: string | null
          created_at: string | null
          customer_id: string | null
          delivered_at: string | null
          delivery_address_id: string | null
          delivery_fee: number | null
          discount: number | null
          estimated_delivery_time: string | null
          id: string
          notes: string | null
          payment_method: string
          payment_status: string | null
          status: string | null
          subtotal: number
          total: number
          updated_at: string | null
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          delivery_address_id?: string | null
          delivery_fee?: number | null
          discount?: number | null
          estimated_delivery_time?: string | null
          id?: string
          notes?: string | null
          payment_method: string
          payment_status?: string | null
          status?: string | null
          subtotal: number
          total: number
          updated_at?: string | null
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          delivery_address_id?: string | null
          delivery_fee?: number | null
          discount?: number | null
          estimated_delivery_time?: string | null
          id?: string
          notes?: string | null
          payment_method?: string
          payment_status?: string | null
          status?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "delivery_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          balance: number | null
          created_at: string | null
          daily_withdrawals: number | null
          id: string
          last_withdrawal_date: string | null
          level: number | null
          password_hash: string
          total_earnings: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          daily_withdrawals?: number | null
          id?: string
          last_withdrawal_date?: string | null
          level?: number | null
          password_hash: string
          total_earnings?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          daily_withdrawals?: number | null
          id?: string
          last_withdrawal_date?: string | null
          level?: number | null
          password_hash?: string
          total_earnings?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      portfolio_data: {
        Row: {
          daily_pnl: number
          id: string
          last_updated: string
          total_balance: number
          user_id: string
        }
        Insert: {
          daily_pnl?: number
          id?: string
          last_updated?: string
          total_balance?: number
          user_id: string
        }
        Update: {
          daily_pnl?: number
          id?: string
          last_updated?: string
          total_balance?: number
          user_id?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          alert_type: string
          created_at: string
          current_value: number | null
          id: string
          is_active: boolean
          is_triggered: boolean
          message: string | null
          notification_method: string
          symbol: string
          target_value: number
          triggered_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          current_value?: number | null
          id?: string
          is_active?: boolean
          is_triggered?: boolean
          message?: string | null
          notification_method?: string
          symbol: string
          target_value: number
          triggered_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          current_value?: number | null
          id?: string
          is_active?: boolean
          is_triggered?: boolean
          message?: string | null
          notification_method?: string
          symbol?: string
          target_value?: number
          triggered_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          close_price: number
          created_at: string
          high_price: number
          id: string
          low_price: number
          number_of_trades: number | null
          open_price: number
          quote_volume: number
          symbol: string
          taker_buy_base_volume: number | null
          taker_buy_quote_volume: number | null
          timeframe: string
          timestamp: string
          volume: number
        }
        Insert: {
          close_price: number
          created_at?: string
          high_price: number
          id?: string
          low_price: number
          number_of_trades?: number | null
          open_price: number
          quote_volume?: number
          symbol: string
          taker_buy_base_volume?: number | null
          taker_buy_quote_volume?: number | null
          timeframe: string
          timestamp: string
          volume?: number
        }
        Update: {
          close_price?: number
          created_at?: string
          high_price?: number
          id?: string
          low_price?: number
          number_of_trades?: number | null
          open_price?: number
          quote_volume?: number
          symbol?: string
          taker_buy_base_volume?: number | null
          taker_buy_quote_volume?: number | null
          timeframe?: string
          timestamp?: string
          volume?: number
        }
        Relationships: []
      }
      product_options: {
        Row: {
          created_at: string | null
          id: string
          is_required: boolean | null
          max_selections: number | null
          name: string
          option_type: string
          price_modifier: number | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          max_selections?: number | null
          name: string
          option_type: string
          price_modifier?: number | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          max_selections?: number | null
          name?: string
          option_type?: string
          price_modifier?: number | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          preparation_time: number | null
          updated_at: string | null
        }
        Insert: {
          base_price: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          preparation_time?: number | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          preparation_time?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          has_seen_tutorial: boolean
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          has_seen_tutorial?: boolean
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          has_seen_tutorial?: boolean
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string | null
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string | null
          id: string
          is_active: boolean | null
          min_order_value: number | null
          name: string
          start_date: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          min_order_value?: number | null
          name: string
          start_date?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          min_order_value?: number | null
          name?: string
          start_date?: string | null
        }
        Relationships: []
      }
      real_time_patterns: {
        Row: {
          closed_at: string | null
          confidence_score: number
          created_at: string
          entry_price: number
          executed: boolean
          executed_at: string | null
          expires_at: string | null
          id: string
          identified_at: string
          is_active: boolean
          market_structure: Json
          pattern_data: Json
          pattern_type: string
          profit_achieved: number | null
          risk_reward_ratio: number
          stop_loss: number
          symbol: string
          target_price: number
          timeframe: string
          updated_at: string
          user_id: string
          volume_profile: Json
        }
        Insert: {
          closed_at?: string | null
          confidence_score: number
          created_at?: string
          entry_price: number
          executed?: boolean
          executed_at?: string | null
          expires_at?: string | null
          id?: string
          identified_at?: string
          is_active?: boolean
          market_structure?: Json
          pattern_data?: Json
          pattern_type: string
          profit_achieved?: number | null
          risk_reward_ratio: number
          stop_loss: number
          symbol: string
          target_price: number
          timeframe: string
          updated_at?: string
          user_id: string
          volume_profile?: Json
        }
        Update: {
          closed_at?: string | null
          confidence_score?: number
          created_at?: string
          entry_price?: number
          executed?: boolean
          executed_at?: string | null
          expires_at?: string | null
          id?: string
          identified_at?: string
          is_active?: boolean
          market_structure?: Json
          pattern_data?: Json
          pattern_type?: string
          profit_achieved?: number | null
          risk_reward_ratio?: number
          stop_loss?: number
          symbol?: string
          target_price?: number
          timeframe?: string
          updated_at?: string
          user_id?: string
          volume_profile?: Json
        }
        Relationships: []
      }
      real_time_performance: {
        Row: {
          active_positions: number
          avg_loss: number
          avg_win: number
          consecutive_losses: number
          consecutive_wins: number
          created_at: string
          current_balance: number
          id: string
          largest_loss: number
          largest_win: number
          losing_trades: number
          market_exposure: Json
          max_drawdown: number
          profit_factor: number
          realized_pnl: number
          risk_metrics: Json
          session_date: string
          sharpe_ratio: number
          starting_balance: number
          strategies_used: Json
          total_fees_paid: number
          total_trades: number
          unrealized_pnl: number
          updated_at: string
          user_id: string
          win_rate: number
          winning_trades: number
        }
        Insert: {
          active_positions?: number
          avg_loss?: number
          avg_win?: number
          consecutive_losses?: number
          consecutive_wins?: number
          created_at?: string
          current_balance: number
          id?: string
          largest_loss?: number
          largest_win?: number
          losing_trades?: number
          market_exposure?: Json
          max_drawdown?: number
          profit_factor?: number
          realized_pnl?: number
          risk_metrics?: Json
          session_date?: string
          sharpe_ratio?: number
          starting_balance: number
          strategies_used?: Json
          total_fees_paid?: number
          total_trades?: number
          unrealized_pnl?: number
          updated_at?: string
          user_id: string
          win_rate?: number
          winning_trades?: number
        }
        Update: {
          active_positions?: number
          avg_loss?: number
          avg_win?: number
          consecutive_losses?: number
          consecutive_wins?: number
          created_at?: string
          current_balance?: number
          id?: string
          largest_loss?: number
          largest_win?: number
          losing_trades?: number
          market_exposure?: Json
          max_drawdown?: number
          profit_factor?: number
          realized_pnl?: number
          risk_metrics?: Json
          session_date?: string
          sharpe_ratio?: number
          starting_balance?: number
          strategies_used?: Json
          total_fees_paid?: number
          total_trades?: number
          unrealized_pnl?: number
          updated_at?: string
          user_id?: string
          win_rate?: number
          winning_trades?: number
        }
        Relationships: []
      }
      risk_analysis: {
        Row: {
          analysis_date: string
          beta: number
          correlation_risk: number
          created_at: string
          cvar: number
          id: string
          liquidity_risk: number
          market_risk: number
          max_position_size: number
          portfolio_risk: number
          recommended_position_size: number
          stop_loss_suggestion: number
          symbol: string
          take_profit_suggestion: number
          user_id: string
          var_1_day: number
          var_7_day: number
          volatility_score: number
        }
        Insert: {
          analysis_date?: string
          beta: number
          correlation_risk: number
          created_at?: string
          cvar: number
          id?: string
          liquidity_risk: number
          market_risk: number
          max_position_size: number
          portfolio_risk: number
          recommended_position_size: number
          stop_loss_suggestion: number
          symbol: string
          take_profit_suggestion: number
          user_id: string
          var_1_day: number
          var_7_day: number
          volatility_score: number
        }
        Update: {
          analysis_date?: string
          beta?: number
          correlation_risk?: number
          created_at?: string
          cvar?: number
          id?: string
          liquidity_risk?: number
          market_risk?: number
          max_position_size?: number
          portfolio_risk?: number
          recommended_position_size?: number
          stop_loss_suggestion?: number
          symbol?: string
          take_profit_suggestion?: number
          user_id?: string
          var_1_day?: number
          var_7_day?: number
          volatility_score?: number
        }
        Relationships: []
      }
      risk_settings: {
        Row: {
          ai_level: number
          created_at: string
          id: string
          is_trading_active: boolean
          max_daily_loss: number
          max_risk_per_trade: number
          stop_loss_enabled: boolean
          trading_mode: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_level?: number
          created_at?: string
          id?: string
          is_trading_active?: boolean
          max_daily_loss?: number
          max_risk_per_trade?: number
          stop_loss_enabled?: boolean
          trading_mode?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_level?: number
          created_at?: string
          id?: string
          is_trading_active?: boolean
          max_daily_loss?: number
          max_risk_per_trade?: number
          stop_loss_enabled?: boolean
          trading_mode?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          log_level: string
          message: string
          metadata: Json | null
          module: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          log_level?: string
          message: string
          metadata?: Json | null
          module: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          log_level?: string
          message?: string
          metadata?: Json | null
          module?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      technical_indicators: {
        Row: {
          adx: number | null
          aroon_down: number | null
          aroon_up: number | null
          atr: number | null
          bb_lower: number | null
          bb_middle: number | null
          bb_upper: number | null
          bearish_signals: number
          bullish_signals: number
          calculated_at: string
          cci: number | null
          chaikin_oscillator: number | null
          created_at: string
          ema_200: number | null
          ema_21: number | null
          ema_50: number | null
          ema_9: number | null
          fibonacci_levels: Json | null
          ichimoku_data: Json | null
          id: string
          keltner_lower: number | null
          keltner_middle: number | null
          keltner_upper: number | null
          macd_histogram: number | null
          macd_line: number | null
          macd_signal: number | null
          mfi: number | null
          momentum: number | null
          obv: number | null
          parabolic_sar: number | null
          pivot_points: Json | null
          ppo: number | null
          roc: number | null
          rsi_14: number | null
          rsi_21: number | null
          signal_strength: number
          sma_20: number | null
          sma_200: number | null
          sma_50: number | null
          stochastic_d: number | null
          stochastic_k: number | null
          symbol: string
          timeframe: string
          trix: number | null
          ultimate_oscillator: number | null
          user_id: string
          vwap: number | null
          williams_r: number | null
        }
        Insert: {
          adx?: number | null
          aroon_down?: number | null
          aroon_up?: number | null
          atr?: number | null
          bb_lower?: number | null
          bb_middle?: number | null
          bb_upper?: number | null
          bearish_signals?: number
          bullish_signals?: number
          calculated_at?: string
          cci?: number | null
          chaikin_oscillator?: number | null
          created_at?: string
          ema_200?: number | null
          ema_21?: number | null
          ema_50?: number | null
          ema_9?: number | null
          fibonacci_levels?: Json | null
          ichimoku_data?: Json | null
          id?: string
          keltner_lower?: number | null
          keltner_middle?: number | null
          keltner_upper?: number | null
          macd_histogram?: number | null
          macd_line?: number | null
          macd_signal?: number | null
          mfi?: number | null
          momentum?: number | null
          obv?: number | null
          parabolic_sar?: number | null
          pivot_points?: Json | null
          ppo?: number | null
          roc?: number | null
          rsi_14?: number | null
          rsi_21?: number | null
          signal_strength?: number
          sma_20?: number | null
          sma_200?: number | null
          sma_50?: number | null
          stochastic_d?: number | null
          stochastic_k?: number | null
          symbol: string
          timeframe: string
          trix?: number | null
          ultimate_oscillator?: number | null
          user_id: string
          vwap?: number | null
          williams_r?: number | null
        }
        Update: {
          adx?: number | null
          aroon_down?: number | null
          aroon_up?: number | null
          atr?: number | null
          bb_lower?: number | null
          bb_middle?: number | null
          bb_upper?: number | null
          bearish_signals?: number
          bullish_signals?: number
          calculated_at?: string
          cci?: number | null
          chaikin_oscillator?: number | null
          created_at?: string
          ema_200?: number | null
          ema_21?: number | null
          ema_50?: number | null
          ema_9?: number | null
          fibonacci_levels?: Json | null
          ichimoku_data?: Json | null
          id?: string
          keltner_lower?: number | null
          keltner_middle?: number | null
          keltner_upper?: number | null
          macd_histogram?: number | null
          macd_line?: number | null
          macd_signal?: number | null
          mfi?: number | null
          momentum?: number | null
          obv?: number | null
          parabolic_sar?: number | null
          pivot_points?: Json | null
          ppo?: number | null
          roc?: number | null
          rsi_14?: number | null
          rsi_21?: number | null
          signal_strength?: number
          sma_20?: number | null
          sma_200?: number | null
          sma_50?: number | null
          stochastic_d?: number | null
          stochastic_k?: number | null
          symbol?: string
          timeframe?: string
          trix?: number | null
          ultimate_oscillator?: number | null
          user_id?: string
          vwap?: number | null
          williams_r?: number | null
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          created_at: string | null
          eliminated_at: string | null
          id: string
          player_id: string | null
          position: number | null
          tournament_id: string | null
        }
        Insert: {
          created_at?: string | null
          eliminated_at?: string | null
          id?: string
          player_id?: string | null
          position?: number | null
          tournament_id?: string | null
        }
        Update: {
          created_at?: string | null
          eliminated_at?: string | null
          id?: string
          player_id?: string | null
          position?: number | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string | null
          current_players: number | null
          entry_fee: number
          finished_at: string | null
          game_type: string
          id: string
          max_players: number | null
          started_at: string | null
          status: string | null
          total_prize: number | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_players?: number | null
          entry_fee: number
          finished_at?: string | null
          game_type: string
          id?: string
          max_players?: number | null
          started_at?: string | null
          status?: string | null
          total_prize?: number | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_players?: number | null
          entry_fee?: number
          finished_at?: string | null
          game_type?: string
          id?: string
          max_players?: number | null
          started_at?: string | null
          status?: string | null
          total_prize?: number | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      trader_statistics: {
        Row: {
          avg_trade_duration: unknown | null
          best_trade: number | null
          consistency_score: number | null
          created_at: string
          id: string
          losing_trades: number
          max_drawdown: number
          period_end: string
          period_start: string
          period_type: string
          profit_factor: number | null
          risk_score: number | null
          sharpe_ratio: number | null
          total_pnl: number
          total_trades: number
          total_volume: number
          updated_at: string
          user_id: string
          win_rate: number
          winning_trades: number
          worst_trade: number | null
        }
        Insert: {
          avg_trade_duration?: unknown | null
          best_trade?: number | null
          consistency_score?: number | null
          created_at?: string
          id?: string
          losing_trades?: number
          max_drawdown?: number
          period_end: string
          period_start: string
          period_type: string
          profit_factor?: number | null
          risk_score?: number | null
          sharpe_ratio?: number | null
          total_pnl?: number
          total_trades?: number
          total_volume?: number
          updated_at?: string
          user_id: string
          win_rate?: number
          winning_trades?: number
          worst_trade?: number | null
        }
        Update: {
          avg_trade_duration?: unknown | null
          best_trade?: number | null
          consistency_score?: number | null
          created_at?: string
          id?: string
          losing_trades?: number
          max_drawdown?: number
          period_end?: string
          period_start?: string
          period_type?: string
          profit_factor?: number | null
          risk_score?: number | null
          sharpe_ratio?: number | null
          total_pnl?: number
          total_trades?: number
          total_volume?: number
          updated_at?: string
          user_id?: string
          win_rate?: number
          winning_trades?: number
          worst_trade?: number | null
        }
        Relationships: []
      }
      trading_operations: {
        Row: {
          actual_profit: number | null
          ai_confidence: number | null
          binance_order_id: string | null
          created_at: string
          exit_reason: string | null
          expected_profit: number | null
          fees: number | null
          id: string
          market_sentiment: number | null
          operation_type: string
          pattern_used: string | null
          price: number
          quantity: number
          risk_score: number | null
          status: string
          stop_loss_price: number | null
          symbol: string
          take_profit_price: number | null
          technical_score: number | null
          total_value: number
          user_id: string
        }
        Insert: {
          actual_profit?: number | null
          ai_confidence?: number | null
          binance_order_id?: string | null
          created_at?: string
          exit_reason?: string | null
          expected_profit?: number | null
          fees?: number | null
          id?: string
          market_sentiment?: number | null
          operation_type: string
          pattern_used?: string | null
          price: number
          quantity: number
          risk_score?: number | null
          status?: string
          stop_loss_price?: number | null
          symbol: string
          take_profit_price?: number | null
          technical_score?: number | null
          total_value: number
          user_id: string
        }
        Update: {
          actual_profit?: number | null
          ai_confidence?: number | null
          binance_order_id?: string | null
          created_at?: string
          exit_reason?: string | null
          expected_profit?: number | null
          fees?: number | null
          id?: string
          market_sentiment?: number | null
          operation_type?: string
          pattern_used?: string | null
          price?: number
          quantity?: number
          risk_score?: number | null
          status?: string
          stop_loss_price?: number | null
          symbol?: string
          take_profit_price?: number | null
          technical_score?: number | null
          total_value?: number
          user_id?: string
        }
        Relationships: []
      }
      trading_sessions: {
        Row: {
          created_at: string
          current_mode: string
          demo_balance: number
          id: string
          is_bot_active: boolean
          is_connected: boolean
          is_trading_active: boolean
          last_activity: string
          real_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_mode?: string
          demo_balance?: number
          id?: string
          is_bot_active?: boolean
          is_connected?: boolean
          is_trading_active?: boolean
          last_activity?: string
          real_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_mode?: string
          demo_balance?: number
          id?: string
          is_bot_active?: boolean
          is_connected?: boolean
          is_trading_active?: boolean
          last_activity?: string
          real_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          pix_key: string | null
          player_id: string | null
          status: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          pix_key?: string | null
          player_id?: string | null
          status?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          pix_key?: string | null
          player_id?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      user_binance_credentials: {
        Row: {
          api_key_encrypted: string
          created_at: string
          id: string
          is_active: boolean
          secret_key_encrypted: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key_encrypted: string
          created_at?: string
          id?: string
          is_active?: boolean
          secret_key_encrypted: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key_encrypted?: string
          created_at?: string
          id?: string
          is_active?: boolean
          secret_key_encrypted?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          chart_settings: Json
          created_at: string
          currency: string
          id: string
          language: string
          notification_settings: Json
          privacy_settings: Json
          theme: string
          timezone: string
          trading_preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          chart_settings?: Json
          created_at?: string
          currency?: string
          id?: string
          language?: string
          notification_settings?: Json
          privacy_settings?: Json
          theme?: string
          timezone?: string
          trading_preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          chart_settings?: Json
          created_at?: string
          currency?: string
          id?: string
          language?: string
          notification_settings?: Json
          privacy_settings?: Json
          theme?: string
          timezone?: string
          trading_preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      volume_analysis: {
        Row: {
          accumulation_distribution: number
          analyzed_at: string
          buy_volume: number
          created_at: string
          id: string
          institutional_flow: number
          large_orders_count: number
          money_flow_index: number
          on_balance_volume: number
          retail_flow: number
          sell_volume: number
          support_resistance_levels: Json | null
          symbol: string
          timeframe: string
          user_id: string
          volume_24h: number
          volume_avg_7d: number
          volume_delta: number
          volume_profile: Json | null
          volume_ratio: number
          volume_weighted_price: number
          whale_activity_score: number
        }
        Insert: {
          accumulation_distribution: number
          analyzed_at?: string
          buy_volume: number
          created_at?: string
          id?: string
          institutional_flow?: number
          large_orders_count?: number
          money_flow_index: number
          on_balance_volume: number
          retail_flow?: number
          sell_volume: number
          support_resistance_levels?: Json | null
          symbol: string
          timeframe: string
          user_id: string
          volume_24h: number
          volume_avg_7d: number
          volume_delta: number
          volume_profile?: Json | null
          volume_ratio: number
          volume_weighted_price: number
          whale_activity_score?: number
        }
        Update: {
          accumulation_distribution?: number
          analyzed_at?: string
          buy_volume?: number
          created_at?: string
          id?: string
          institutional_flow?: number
          large_orders_count?: number
          money_flow_index?: number
          on_balance_volume?: number
          retail_flow?: number
          sell_volume?: number
          support_resistance_levels?: Json | null
          symbol?: string
          timeframe?: string
          user_id?: string
          volume_24h?: number
          volume_avg_7d?: number
          volume_delta?: number
          volume_profile?: Json | null
          volume_ratio?: number
          volume_weighted_price?: number
          whale_activity_score?: number
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string | null
          fee_amount: number | null
          fee_percentage: number | null
          id: string
          pix_key: string
          player_id: string | null
          processed_at: string | null
          qr_code_id: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          fee_amount?: number | null
          fee_percentage?: number | null
          id?: string
          pix_key: string
          player_id?: string | null
          processed_at?: string | null
          qr_code_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          fee_amount?: number | null
          fee_percentage?: number | null
          id?: string
          pix_key?: string
          player_id?: string | null
          processed_at?: string | null
          qr_code_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_real_time_metrics: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      calculate_trader_statistics: {
        Args: {
          p_user_id: string
          p_period_type: string
          p_start_date: string
          p_end_date: string
        }
        Returns: undefined
      }
      calculate_withdrawal_fee: {
        Args: { player_level: number; withdrawal_amount: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
