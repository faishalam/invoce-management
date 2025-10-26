"use client";

import { Controller } from "react-hook-form";
import { useUserLogin } from "../hooks";
import Link from "next/link";
import ContinueWithSection from "./ContinueWithSection";
import { CInput } from "@/components/atoms";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import EmailIcon from "@mui/icons-material/Email";
import CIconButton from "@/components/atoms/icon-button";
import { Button } from "@mui/material";

export default function FormLoginSection() {
  const { handleSubmit, errors, isLoadingLogin, control, onSubmit, onInvalid } =
    useUserLogin();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  return (
    <>
      <div className="flex flex-col gap-5 max-w-md w-full">
        <div>
          <p className="text-3xl font-semibold">Hai, Selamat Datang</p>
          <p className="text-3xl font-semibold">
            di <span className="text-blue-900">BA & DN Management</span>
          </p>
        </div>
        <p className="text-md font-medium">Silakan Masuk</p>
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="flex flex-col gap-3"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CInput
                {...field}
                id="email"
                label="Email*"
                placeholder="email@example.co.id"
                required
                autoComplete="off"
                error={!!errors.email}
                slotProps={{
                  input: {
                    startAdornment: (
                      <EmailIcon
                        className="text-gray-400"
                        style={{ fontSize: "1.3rem" }}
                      />
                    ),
                  },
                }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <CInput
                label="Password*"
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                {...field}
                required
                error={!!errors.password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <CIconButton
                        size="small"
                        edge="end"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? (
                          <VisibilityOff className="text-gray-400" />
                        ) : (
                          <Visibility className="text-gray-400" />
                        )}
                      </CIconButton>
                    ),
                    startAdornment: (
                      <LockOutlineIcon
                        className="text-gray-400"
                        style={{ fontSize: "1.3rem" }}
                      />
                    ),
                  },
                }}
              />
            )}
          />

          <div className="flex items-center justify-between max-w-md w-full">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm leading-6 text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm leading-6">
              <Link
                href={""}
                className="font-medium text-green-500 hover:text-green-600 transition cursor-not-allowed"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              variant="contained"
              color={"secondary"}
              loading={isLoadingLogin}
            >
            Login
            </Button>
          </div>
          <ContinueWithSection />
        </form>
      </div>
    </>
  );
}
