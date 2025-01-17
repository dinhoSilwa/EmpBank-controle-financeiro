import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FinancialRecordsSchema } from "../../models/schemas/youpschemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHTTPtransactions } from "../../service/usehttp";
import { TransactionService } from "../../service/transactions/service";
import type { FinancialRecords } from "../../models/TransactionsTypes/transactions";
import { useTransactions } from "../getTransactions/useTransactionsList";


export const useFinancialRecord = () => {

  const {refetch} =useTransactions()
  const api = useHTTPtransactions();
  const queyKey = useQueryClient();
  const QUERY_KEY = ["transaction-query"] as const;
  const service = new TransactionService();

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FinancialRecords>({
    resolver: yupResolver<any>(FinancialRecordsSchema),
  });

  const mutation = useMutation<any, unknown, FinancialRecords, unknown>({
    mutationFn: (data) => service.createTransaction(api, data),
    onSuccess: () => {
      queyKey.invalidateQueries({ queryKey: QUERY_KEY });
      refetch()
    },
  });

  const onsubmit = (data: FinancialRecords) => {
    data.day = new Date().toLocaleDateString()
    mutation.mutate(data)
    console.log("isso que é enviado", data.amount)
  };

  return {
    handleSubmit: handleSubmit(onsubmit),
    data: mutation.data,
    isSuccessForm : mutation.isSuccess,
    isLoadingForm : mutation.isPending,
    register,
    watch,
    errors,
    setValue,
    setError,
  };
};
