import { useMemo } from 'react'

type RenderTransactionStatusProps = {
  status: string
}
const RenderTransactionStatus: React.FC<RenderTransactionStatusProps> = ({ status }) => {
  const statusClassName = useMemo(() => {
    switch (status) {
      case 'draft':
        return 'bg-[#e6e7eb] text-black'
      case 'cancelled':
        return 'bg-[#FECACA] text-[#7F1D1D]'
      case 'rejected':
        return 'bg-[#FECACA] text-[#7F1D1D]'
      case 'approval_1':
        return 'bg-[#c0d2f6] text-[#123478]'
      case 'approval_2':
        return 'bg-[#c0d2f6] text-[#123478]'
      case 'approval_3':
        return 'bg-[#c0d2f6] text-[#123478]'
      case 'submitted':
        return 'bg-[#f3e8ff] text-[#8d52bd]'
      case 'revised':
        return 'bg-[#f3e8ff] text-[#8d52bd]'
      case 'quotation_returned':
        return 'bg-[#FEF9C3] text-[#854D0E]'
      case 'inquiry_returned':
        return 'bg-[#fef9c3] text-[#a77d41]'
      case 'open':
        return 'bg-[#c0d2f6] text-[#123478]'
      case 'under_amandement':
        return 'bg-[#ffedd5] text-[#a37341]'
      case 'responded':
        return 'bg-[#f3e8ff] text-[#8d52bd]'
      case 'completed':
        return 'bg-[#dcfce7] text-[#156534]'
      case 'accepted':
        return 'bg-[#dcfce7] text-[#156534]'
      case 'deal_approval_1':
        return 'bg-[#ccfbf1] text-[#0f5e59]'
      case 'deal_returned':
        return 'bg-[#ecfccb] text-[#3f6212]'
      case 'active':
        return 'bg-[#dcfce7] text-[#156534]'
      case 'inactive':
        return 'bg-[#FECACA] text-[#7F1D1D]'
      case 'Transporter':
        return 'bg-[#dcfce7] text-[#156534]'
      case 'Charterer':
        return 'bg-[#c0d2f6] text-[#123478]'
      case 'Aggregator':
        return 'bg-[#f3e8ff] text-[#8d52bd]'
      case 'User admin':
        return 'bg-[#fef9c3] text-[#a77d41]'
      case 'Super Admin':
        return 'bg-[#ecfccb] text-[#3f6212]'
      default:
        return 'bg-[#e6e7eb] text-black'
    }
  }, [status])
  const setText = useMemo(() => {
    switch (status) {
      case 'draft':
        return 'Draft'
      case 'cancelled':
        return 'Cancelled'
      case 'submitted':
        return 'On Approval 1'
      case 'approval_1':
        return 'On Approval 2'
      case 'approval_2':
        return 'On Approval 3'
      case 'approval_3':
        return 'On Approval 3'
      case 'revised':
        return 'Inquiry Returned'
      case 'quotation_returned':
        return 'Quotation Returned'
      case 'inquiry_returned':
        return 'Inquiry Returned'
      case 'open':
        return 'Open'
      case 'under_amandement':
        return 'Under Amandement'
      case 'responded':
        return 'Responded'
      case 'accepted':
        return 'Accepted'
      case 'completed':
        return 'Completed'
      case 'deal_approval_1':
        return 'Deal Approval 1'
      case 'deal_returned':
        return 'Deal Returned'
      case 'cancelled':
        return 'Rejected'
      case 'rejected':
        return 'Rejected'
      case 'active':
        return 'Active'
      case 'inactive':
        return 'Inactive'
      case 'Transporter':
        return 'Transporter'
      case 'Charterer':
        return 'Charterer'
      case 'Aggregator':
        return 'Aggregator'
      case 'User admin':
        return 'User Admin'
      case 'Super Admin':
        return 'Super Admin'
      default:
        return 'Draft'
    }
  }, [status])
  // return <small className={`${statusClassName} rounded-full px-4 py-1`}>{setText}</small>
  return (
    <small className={`${statusClassName} rounded-full px-4 py-1 text-xs font-medium inline-block`}>
      {setText}
    </small>
  )
}
export default RenderTransactionStatus
