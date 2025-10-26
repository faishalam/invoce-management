import useGlobal from "@/app/(private)/hooks";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { CAutoComplete, CInput } from "@/components/atoms";
import { Button } from "@mui/material";
import { Controller, useFieldArray } from "react-hook-form";
import useBeritaAcara from "../../hooks";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PlanAlokasiForm() {
  const { control, mode, errors, watch } = useBeritaAcara();
  const { dataGoods, dataSatuan } = useGlobal();

  const {
    fields: fieldsGeneral,
    append: appendGeneral,
    remove: removeGenereal,
  } = useFieldArray({
    control,
    name: "berita_acara_general",
  });
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClearAllIcon className="text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">Informasi General</h2>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            appendGeneral({
              goods_id: "",
              quantity: "",
              satuan: "",
            })
          }
          type="button"
          className="!bg-blue-500"
          disabled={mode === "view"}
        >
          Tambah Item
        </Button>
      </div>

      {/* <div className="-mx-6 border-t border-gray-200" /> */}

      {/* Type of Work - Outside loop (shared for all items) */}
      {/* <div className="w-full">
        <Controller
          name="type_of_work_id"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CAutoComplete
              label="Jenis Pekerjaan*"
              options={dataTypeOfWork?.data || []}
              className="w-full"
              value={
                dataTypeOfWork?.data?.find((item) => item.name === value) ||
                null
              }
              onChange={(_, newValue) =>
                onChange(newValue ? newValue.name : "")
              }
              disabled
              getOptionKey={(option) => option.name}
              getOptionLabel={(option) => option.name}
              placeholder="Pilih Jenis Pekerjaan*"
              error={!!errors.type_of_work_id}
            />
          )}
        />
      </div> */}

      {/* Items Loop */}
      {fieldsGeneral.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada item. Klik Tambah Item untuk menambahkan.</p>
        </div>
      ) : (
        fieldsGeneral.map((field, index) => (
          <div
            key={field.id}
            className="relative border-t border-gray-200 pt-4"
          >
            {/* Delete Button */}
            {fieldsGeneral.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => removeGenereal(index)}
                type="button"
                className="!absolute !top-4 !right-0 !z-10"
                disabled={mode === "view"}
              >
                Hapus Item
              </Button>
            )}

            <div className="flex gap-6 w-full pt-8">
              {/* Left Column */}
              <div className="w-full flex flex-col gap-2">
                <Controller
                  name={`berita_acara_general.${index}.goods_id`}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    const selectedGoods =
                      dataGoods?.data?.find((item) => item.id === value) ||
                      null;
                    return (
                      <CAutoComplete
                        label="Jenis Barang/Jasa*"
                        options={dataGoods?.data || []}
                        className="w-full"
                        value={selectedGoods}
                        onChange={(_, newValue) => {
                          onChange(newValue ? newValue.id : "");
                        }}
                        disabled={mode === "view"}
                        getOptionKey={(option) => option.id}
                        getOptionLabel={(option) => option.name}
                        placeholder="Pilih Jenis Barang/Jasa*"
                        error={!!errors.berita_acara_general?.[index]?.goods_id}
                      />
                    );
                  }}
                />

                <CInput
                  label="Code Backcharge*"
                  className="w-full"
                  type="text"
                  disabled
                  value={
                    dataGoods?.data?.find(
                      (item) =>
                        item.id ===
                        watch(`berita_acara_general.${index}.goods_id`)
                    )?.code || ""
                  }
                  placeholder="Code backcharge"
                />
              </div>

              {/* Right Column */}
              <div className="w-full flex flex-col gap-2">
                <Controller
                  name={`berita_acara_general.${index}.quantity`}
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <CInput
                      {...rest}
                      label="Quantity*"
                      className="w-full"
                      placeholder="Quantity"
                      type="text"
                      value={value}
                      disabled={mode === "view"}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        onChange(onlyNumbers);
                      }}
                      error={!!errors.berita_acara_general?.[index]?.quantity}
                    />
                  )}
                />

                <Controller
                  name={`berita_acara_general.${index}.satuan`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CAutoComplete
                      label="Satuan*"
                      options={dataSatuan?.data || []}
                      className="w-full"
                      value={
                        dataSatuan?.data?.find((item) => item.name === value) ||
                        null
                      }
                      onChange={(_, newValue) =>
                        onChange(newValue ? newValue.name : "")
                      }
                      disabled={mode === "view"}
                      getOptionKey={(option) => option.name}
                      getOptionLabel={(option) => option.name}
                      placeholder="Pilih Satuan*"
                      error={!!errors.berita_acara_general?.[index]?.satuan}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        ))
      )}

      {/* Nill/Ditagihkan - Outside loop (shared) */}
      <div className="w-full mt-4">
        <Controller
          name="nill_ditagihkan"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CAutoComplete
              label="Nill/Ditagihkan*"
              options={[
                { label: "Nill", value: "nill" },
                { label: "Ditagihkan", value: "ditagihkan" },
              ]}
              className="w-full"
              value={
                [
                  { label: "Nill", value: "nill" },
                  { label: "Ditagihkan", value: "ditagihkan" },
                ].find((item) => item.value === value) || null
              }
              onChange={(_, newValue) =>
                onChange(newValue ? newValue.value : "")
              }
              disabled={mode === "view"}
              getOptionKey={(option) => option.value}
              getOptionLabel={(option) => option.label}
              placeholder="Pilih Nill/Ditagihkan*"
              error={!!errors.nill_ditagihkan}
            />
          )}
        />
      </div>
    </>
  );
}
