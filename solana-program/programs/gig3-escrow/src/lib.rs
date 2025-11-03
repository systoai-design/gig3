use anchor_lang::prelude::*;
use anchor_lang::system_program::{Transfer, transfer};

declare_id!("GIG3EscrowProgramIDChangeBeforeDeployment11111");

#[program]
pub mod gig3_escrow {
    use super::*;

    /// Initialize an escrow account for an order
    /// Buyer deposits SOL which is held until mutual agreement or admin intervention
    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        order_id: String,
        amount: u64,
        seller: Pubkey,
        platform_fee_bps: u16, // basis points (500 = 5%)
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.order_id = order_id;
        escrow.buyer = ctx.accounts.buyer.key();
        escrow.seller = seller;
        escrow.amount = amount;
        escrow.platform_fee_bps = platform_fee_bps;
        escrow.is_released = false;
        escrow.bump = *ctx.bumps.get("escrow").unwrap();
        
        // Transfer SOL from buyer to escrow PDA
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.escrow.to_account_info(),
            },
        );
        
        transfer(cpi_context, amount)?;
        
        msg!("Escrow initialized for order: {}", escrow.order_id);
        msg!("Amount: {} lamports", amount);
        
        Ok(())
    }

    /// Release escrow to seller (requires buyer approval or admin)
    pub fn release_escrow(ctx: Context<ReleaseEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(!escrow.is_released, EscrowError::AlreadyReleased);
        
        // Verify signer is either buyer or admin
        let is_buyer = ctx.accounts.signer.key() == escrow.buyer;
        let is_admin = ctx.accounts.admin_config.admins.contains(&ctx.accounts.signer.key());
        
        require!(is_buyer || is_admin, EscrowError::Unauthorized);
        
        // Calculate amounts
        let platform_fee = (escrow.amount as u128)
            .checked_mul(escrow.platform_fee_bps as u128)
            .unwrap()
            .checked_div(10000)
            .unwrap() as u64;
        
        let seller_amount = escrow.amount.checked_sub(platform_fee).unwrap();
        
        // Transfer to seller
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= seller_amount;
        **ctx.accounts.seller.try_borrow_mut_lamports()? += seller_amount;
        
        // Transfer platform fee to treasury
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= platform_fee;
        **ctx.accounts.platform_treasury.try_borrow_mut_lamports()? += platform_fee;
        
        escrow.is_released = true;
        
        msg!("Escrow released for order: {}", escrow.order_id);
        msg!("Seller received: {} lamports", seller_amount);
        msg!("Platform fee: {} lamports", platform_fee);
        
        Ok(())
    }

    /// Refund escrow to buyer (requires admin intervention for disputes)
    pub fn refund_escrow(
        ctx: Context<RefundEscrow>,
        refund_percentage: u16, // 10000 = 100%
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(!escrow.is_released, EscrowError::AlreadyReleased);
        
        // Only admin can issue refunds
        require!(
            ctx.accounts.admin_config.admins.contains(&ctx.accounts.admin.key()),
            EscrowError::AdminOnly
        );
        
        // Calculate refund amount
        let refund_amount = (escrow.amount as u128)
            .checked_mul(refund_percentage as u128)
            .unwrap()
            .checked_div(10000)
            .unwrap() as u64;
        
        let remaining = escrow.amount.checked_sub(refund_amount).unwrap();
        
        // Transfer refund to buyer
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= refund_amount;
        **ctx.accounts.buyer.try_borrow_mut_lamports()? += refund_amount;
        
        // If partial refund, send remainder to seller
        if remaining > 0 {
            **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= remaining;
            **ctx.accounts.seller.try_borrow_mut_lamports()? += remaining;
        }
        
        escrow.is_released = true;
        
        msg!("Escrow refunded for order: {}", escrow.order_id);
        msg!("Buyer refunded: {} lamports ({}%)", refund_amount, refund_percentage / 100);
        
        Ok(())
    }

    /// Initialize admin configuration
    pub fn initialize_admin_config(
        ctx: Context<InitializeAdminConfig>,
        admins: Vec<Pubkey>,
        platform_treasury: Pubkey,
    ) -> Result<()> {
        let admin_config = &mut ctx.accounts.admin_config;
        admin_config.admins = admins;
        admin_config.platform_treasury = platform_treasury;
        admin_config.bump = *ctx.bumps.get("admin_config").unwrap();
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(order_id: String)]
pub struct InitializeEscrow<'info> {
    #[account(
        init,
        payer = buyer,
        space = 8 + Escrow::INIT_SPACE,
        seeds = [b"escrow", order_id.as_bytes()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleaseEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.order_id.as_bytes()],
        bump = escrow.bump,
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(mut)]
    pub seller: SystemAccount<'info>,
    
    #[account(mut)]
    pub platform_treasury: SystemAccount<'info>,
    
    pub signer: Signer<'info>,
    
    #[account(
        seeds = [b"admin_config"],
        bump = admin_config.bump,
    )]
    pub admin_config: Account<'info, AdminConfig>,
}

#[derive(Accounts)]
pub struct RefundEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.order_id.as_bytes()],
        bump = escrow.bump,
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(mut)]
    pub buyer: SystemAccount<'info>,
    
    #[account(mut)]
    pub seller: SystemAccount<'info>,
    
    pub admin: Signer<'info>,
    
    #[account(
        seeds = [b"admin_config"],
        bump = admin_config.bump,
    )]
    pub admin_config: Account<'info, AdminConfig>,
}

#[derive(Accounts)]
pub struct InitializeAdminConfig<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + AdminConfig::INIT_SPACE,
        seeds = [b"admin_config"],
        bump
    )]
    pub admin_config: Account<'info, AdminConfig>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    #[max_len(36)]
    pub order_id: String,
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub amount: u64,
    pub platform_fee_bps: u16,
    pub is_released: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct AdminConfig {
    #[max_len(5)]
    pub admins: Vec<Pubkey>,
    pub platform_treasury: Pubkey,
    pub bump: u8,
}

#[error_code]
pub enum EscrowError {
    #[msg("Escrow already released")]
    AlreadyReleased,
    #[msg("Unauthorized: Only buyer or admin can release escrow")]
    Unauthorized,
    #[msg("Admin privileges required")]
    AdminOnly,
}
